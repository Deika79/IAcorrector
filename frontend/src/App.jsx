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

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "plan_recuperacion.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Error al generar PDF");
    }

    setLoading(false);
  };

  return (
    <div className="app">
      {/* Banner */}
      <img src="/banner.png" alt="banner" className="banner" />

      <div className="card">
        <h1>Generador de Plan de Recuperación</h1>
        <p>
          Sube un examen manuscrito y genera automáticamente ejercicios
          personalizados para el alumno.
        </p>

        <label className="file-input">
          {file ? file.name : "Seleccionar imagen"}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button onClick={subirImagen} disabled={loading}>
          {loading ? "Generando..." : "Generar PDF"}
        </button>
      </div>
    </div>
  );
}

export default App;