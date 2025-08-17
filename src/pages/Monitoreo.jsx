import { useState } from "react";
import "./Monitoreo.css";

const ninosInicial = [
  { id: 1, nombre: "Juan", dominios: [] },
];

const API_URL = "https://bac8be0b-a612-4943-a25f-81b9a30c987e-00-1f69n0mvga52z.janeway.replit.dev/api/domains";

function Monitoreo() {
  const [ninos, setNinos] = useState(ninosInicial);
  const [ninoSeleccionado, setNinoSeleccionado] = useState(null);
  const [nuevoDominio, setNuevoDominio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSeleccionarNino = (nino) => {
    setNinoSeleccionado(nino);
    setNuevoDominio("");
  };

    const bloquearDominio = async () => {
    const dominio = nuevoDominio.trim();

    // Validación: solo un dominio, sin espacios ni comas
    if (!dominio || dominio.includes(" ") || dominio.includes(",")) {
        alert("Por favor ingresa solo un dominio, sin espacios ni comas.");
        return;
    }

    setLoading(true);
    try {
        const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: dominio }),
        });

        // Si la API responde con error, mostrar el mensaje
        if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert("Error al bloquear dominio: " + (errorData.error || res.statusText));
        setLoading(false);
        return;
        }

        setNinos((prevNinos) =>
        prevNinos.map((n) =>
            n.id === ninoSeleccionado.id
            ? { ...n, dominios: [...n.dominios, dominio] }
            : n
        )
        );
        setNinoSeleccionado((prev) => ({
        ...prev,
        dominios: [...prev.dominios, dominio],
        }));
        setNuevoDominio("");
    } catch (e) {
        alert("Error al bloquear dominio: " + e.message);
    }
    setLoading(false);
    };

  const desbloquearDominio = async (dominio) => {
    setLoading(true);
    try {
      await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: dominio }),
      });
      setNinos((prevNinos) =>
        prevNinos.map((n) =>
          n.id === ninoSeleccionado.id
            ? { ...n, dominios: n.dominios.filter((d) => d !== dominio) }
            : n
        )
      );
      setNinoSeleccionado((prev) => ({
        ...prev,
        dominios: prev.dominios.filter((d) => d !== dominio),
      }));
    } catch (e) {
      alert("Error al desbloquear dominio");
    }
    setLoading(false);
  };

  const handleCerrarPestana = () => {
    setNinoSeleccionado(null);
    setNuevoDominio("");
  };

  return (
    <div className="monitoreo-container">
      <div className="sidebar">
        {ninos.map((nino) => (
          <button
            key={nino.id}
            className="nino-btn"
            onClick={() => handleSeleccionarNino(nino)}
          >
            <span className="nino-nombre">{nino.nombre}</span>
          </button>
        ))}
      </div>
      <div className="monitoreo-content">
        <h2>Monitoreo de Niños</h2>
        {!ninoSeleccionado && (
          <p>Selecciona un niño para ver y gestionar sus dominios bloqueados.</p>
        )}
        {ninoSeleccionado && (
          <div className="pestana-cosas">
            <button className="cerrar-pestana" onClick={handleCerrarPestana}>
              X
            </button>
            <h3>{ninoSeleccionado.nombre}</h3>
            <ul>
              {ninoSeleccionado.dominios.map((dominio, idx) => (
                <li key={idx}>
                  {dominio}{" "}
                  <button
                    onClick={() => desbloquearDominio(dominio)}
                    disabled={loading}
                    style={{
                      marginLeft: 8,
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Desbloquear
                  </button>
                </li>
              ))}
            </ul>
            <div className="agregar-cosa">
              <input
                type="text"
                value={nuevoDominio}
                onChange={(e) => setNuevoDominio(e.target.value)}
                placeholder="Agregar dominio (ej: .facebook.com)"
                disabled={loading}
              />
              <button onClick={bloquearDominio} disabled={loading}>
                Bloquear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Monitoreo;