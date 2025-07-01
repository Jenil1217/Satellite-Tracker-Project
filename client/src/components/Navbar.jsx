import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional: for styling

const Navbar = () => {
  return (
    <nav className="navbar">
    <Link to="/">Home</Link>
    <Link to="/visible">Visible Satellites</Link>
    <Link to="/info">Info</Link>
    </nav>

  );
};

export default Navbar;
