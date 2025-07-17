// components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* ☰ Hamburger inside navbar left */}
        <span className="hamburger" onClick={toggleSidebar}>☰</span>
        <Link to="/" className="brand">🛰️ SatTracker</Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="welcome">Welcome, {user.username}</span>
            <button onClick={logout} className="btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link>
            <Link to="/signup" className={isActive('/signup') ? 'active' : ''}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
