import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const subirImagen = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3001/analizar-examen",
        formData,
        { responseType: "blob" }
      );

      // Descargar PDF automáticamente
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "plan_recuperacion.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
      alert("Error al generar PDF");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>📸 Generador de Recuperación</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={subirImagen} disabled={loading}>
        {loading ? "Generando PDF..." : "Generar plan"}
      </button>
    </div>
  );
}

export default App;