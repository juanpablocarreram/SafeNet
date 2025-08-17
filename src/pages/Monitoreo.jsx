import { useState, useEffect } from "react";
import "./Monitoreo.css";

const ninosInicial = [
  { id: 1, nombre: "Juan", dominios: [] },
];

const API_URL = "https://bac8be0b-a612-4943-a25f-81b9a30c987e-00-1f69n0mvga52z.janeway.replit.dev/api/domains";
const FETCH_URL = "https://bac8be0b-a612-4943-a25f-81b9a30c987e-00-1f69n0mvga52z.janeway.replit.dev/";

function Monitoreo() {
  const [ninos, setNinos] = useState(ninosInicial);
  const [ninoSeleccionado, setNinoSeleccionado] = useState(null);
  const [nuevoDominio, setNuevoDominio] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Indica si es la primera carga de dominios

  // Hook para actualizar la lista de dominios bloqueados constantemente
  useEffect(() => {
    const fetchDominios = async () => {
      try {
        const response = await fetch(FETCH_URL);
        const data = await response.text();
        const dominiosBloqueados = data.split("\n").filter((dominio) => dominio.trim() !== "");

        // Actualizar la lista de dominios en el estado global
        setNinos((prevNinos) =>
          prevNinos.map((nino) =>
            nino.id === ninoSeleccionado?.id
              ? { ...nino, dominios: Array.from(new Set([...nino.dominios, ...dominiosBloqueados])) }
              : nino
          )
        );

        // Actualizar la lista de dominios en el niño seleccionado
        if (ninoSeleccionado) {
          setNinoSeleccionado((prev) => ({
            ...prev,
            dominios: Array.from(new Set([...prev.dominios, ...dominiosBloqueados])),
          }));
        }

        // Marcar que la primera carga ha terminado
        setIsFirstLoad(false);
      } catch (error) {
        console.error("Error al obtener dominios bloqueados:", error);
      }
    };

    // Configurar el intervalo para actualizar cada 10 segundos
    const interval = setInterval(fetchDominios, 10000);
    fetchDominios(); // Llamar inmediatamente al montar el componente

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [ninoSeleccionado]);

  const handleSeleccionarNino = (nino) => {
    setNinoSeleccionado(nino);
    setNuevoDominio("");
  };

  const bloquearDominio = async () => {
    const dominio = nuevoDominio.trim();

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

      if (!res.ok) {
        alert("Error al bloquear dominio");
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
            <h3>{ninoSeleccionado.nombre}</h3>
            {isFirstLoad ? ( // Mostrar mensaje de carga solo antes del primer request
              <p>Cargando dominios...</p>
            ) : (
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
            )}
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