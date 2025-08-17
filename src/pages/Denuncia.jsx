import "./Denuncia.css";
import DenunciaImagen from "../assets/Denuncia.png"
function Denuncia() {
  return (
    <section className="denuncia-section">
      <div className="denuncia-content">
        <h1 className="denuncia-title">Promovamos la Denuncia de Delitos Digitales</h1>
        <img src={DenunciaImagen} className="denuncia-imagen"></img>
        <p className="denuncia-description">
          En México, los delitos digitales son una amenaza creciente que afecta a niños, jóvenes y adultos. 
          Denunciar estos actos es esencial para proteger a nuestras familias y fomentar un entorno digital más seguro.
        </p>
        <h2 className="denuncia-subtitle">¿Por qué es importante denunciar?</h2>
        <p className="denuncia-text">
          La denuncia no solo ayuda a las autoridades a identificar y detener a los responsables, sino que también 
          contribuye a prevenir futuros delitos. Además, permite generar estadísticas que ayudan a crear políticas públicas 
          más efectivas contra el cibercrimen.
        </p>
        <h2 className="denuncia-subtitle">¿Cómo puedes denunciar un delito digital?</h2>
        <ul className="denuncia-steps">
          <li>1. Reúne toda la evidencia posible, como capturas de pantalla, correos electrónicos o mensajes.</li>
          <li>2. Contacta a la <strong>Policía Cibernética</strong> de tu estado o a la <strong>Guardia Nacional</strong>.</li>
          <li>3. Presenta tu denuncia en el <strong>Ministerio Público</strong> más cercano.</li>
          <li>4. Si prefieres mantener el anonimato, llama al <strong>089</strong>.</li>
        </ul>
        <p className="denuncia-note">
          Recuerda que tu denuncia es completamente confidencial y puede marcar la diferencia para proteger a otros.
        </p>
      </div>
    </section>
  );
}

export default Denuncia;