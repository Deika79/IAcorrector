import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";
import Tesseract from "tesseract.js";

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

    // 🧠 OCR: leer texto de la imagen
    const {
      data: { text },
    } = await Tesseract.recognize(rutaImagen, "spa");

    console.log("Texto detectado:", text);

    // 🧠 IA analiza el texto REAL
    const prompt = `
Eres un profesor experto.

Este es un examen REAL de un alumno que ha suspendido:

"${text}"

Haz lo siguiente:

1. Detecta errores del alumno
2. Explica qué no entiende
3. Genera un plan de recuperación
4. Crea 5 ejercicios personalizados para mejorar

IMPORTANTE:
- Sé concreto
- No inventes cosas que no estén en el texto
- Usa lenguaje claro para el alumno
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    fs.unlinkSync(rutaImagen);

    res.json({
      resultado: response.choices[0].message.content,
      textoDetectado: text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al analizar examen" });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});