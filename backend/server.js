import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analizar-examen", upload.single("imagen"), async (req, res) => {
  try {
    const rutaImagen = req.file.path;

    const imageBuffer = fs.readFileSync(rutaImagen);
    const base64Image = imageBuffer.toString("base64");

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Eres un profesor experto de primaria.

Analiza este examen manuscrito.

Devuelve EXACTAMENTE en este formato:

ERRORES:
...

PLAN:
...

EJERCICIOS:
1.
2.
3.
4.
5.
              `,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    const contenido = response.choices[0].message.content;

    // 📄 Crear PDF
    const doc = new PDFDocument();
    const fileName = `reporte_${Date.now()}.pdf`;
    const filePath = path.join("uploads", fileName);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text("📚 Plan de Recuperación", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(contenido);

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, fileName, () => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(rutaImagen);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar PDF" });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});