import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [resultado, setResultado] = useState("");
  const [textoDetectado, setTextoDetectado] = useState("");
  const [loading, setLoading] = useState(false);

  const subirImagen = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3001/analizar-examen",
        formData
      );

      setResultado(res.data.resultado);
      setTextoDetectado(res.data.textoDetectado);
    } catch (error) {
      setResultado("Error al analizar");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>📸 Corrector Inteligente</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={subirImagen} disabled={loading}>
        {loading ? "Analizando..." : "Analizar examen"}
      </button>

      <h2>🧾 Texto detectado:</h2>
      <pre>{textoDetectado}</pre>

      <h2>🧠 Resultado:</h2>
      <pre>{resultado}</pre>
    </div>
  );
}

export default App;