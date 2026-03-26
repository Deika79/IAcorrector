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

    // ⚠️ MOMENTO SIMPLIFICADO (luego metemos OCR real)
    const prompt = `
Eres un profesor experto.

A partir de un examen suspenso, genera:

1. Lista de errores típicos del alumno
2. Plan de mejora
3. 5 ejercicios personalizados

Devuelve en formato claro.

(Asume que el alumno ha fallado conceptos básicos)
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    fs.unlinkSync(rutaImagen); // borrar imagen

    res.json({
      resultado: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error" });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});