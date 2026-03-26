import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analizar-examen", upload.single("imagen"), async (req, res) => {
  try {
    const rutaImagen = req.file.path;

    // Convertir imagen a base64
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

Estás viendo un examen REAL escrito a mano por un alumno.

Haz lo siguiente:

1. Interpreta lo que ha escrito (aunque esté mal escrito)
2. Detecta errores de concepto
3. Explica qué no entiende el alumno
4. Genera un plan de recuperación claro
5. Crea 5 ejercicios personalizados adaptados a su nivel

IMPORTANTE:
- No seas genérico
- Adapta el lenguaje a un niño
- Sé claro y útil para el profesor
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

    fs.unlinkSync(rutaImagen);

    res.json({
      resultado: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al analizar examen" });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});