import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/corregir", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "No hay texto" });
    }

    const prompt = `
Eres un profesor experto.

Corrige el siguiente texto de un alumno.

Devuelve SIEMPRE en este formato:

NOTA: (0-10)

ERRORES:
- error 1
- error 2

FEEDBACK:
Explicación clara y personalizada para el alumno.

TEXTO:
${texto}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const resultado = response.choices[0].message.content;

    res.json({ resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al corregir" });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});