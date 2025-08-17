import { NavLink } from 'react-router-dom';
import './Header.css'; // Importamos los estilos
import logo from "../assets/logo.png"
export default function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Representative Image of the App" className='logo' />
      <nav className="nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          Monitoreo
        </NavLink>
        <NavLink to="/chatbot" className={({ isActive }) => isActive ? 'active' : ''}>
          Chatbot
        </NavLink>
        <NavLink to="/estudios" className={({ isActive }) => isActive ? 'active' : ''}>
          Estudios
        </NavLink>
      </nav>
    </header>
  );
}
