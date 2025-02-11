import { Link } from "react-router-dom";
import '../styles/nav.css';

function Nav() {
  return (
    <nav className="Nav">
      <div className="navbar-logo">
        {/* Cambiamos a una ruta relativa para la imagen en public */}
        <a href="/">
          <img src="/KiddaLogo.png" alt="Kidda Logo" />
        </a>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">INICIO</Link>
        </li>
        <li>
          <Link to="/revistas">REVISTAS</Link>
        </li>
        <li>
          <Link to="/admin">PANEL</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
