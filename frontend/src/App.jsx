import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);

  const corregirTexto = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/corregir", {
        texto,
      });
      setResultado(res.data.resultado);
    } catch (error) {
      setResultado("Error al corregir");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🧠 Corrector IA</h1>

      <textarea
        placeholder="Pega aquí el texto del alumno..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <button onClick={corregirTexto} disabled={loading}>
        {loading ? "Corrigiendo..." : "Corregir"}
      </button>

      <pre>{resultado}</pre>
    </div>
  );
}

export default App;