// components/Sidebar.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ open, setOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <>
      <div className={`sidebar ${open ? 'open' : ''}`}>
        {/* Avatar + Username */}
        {user && (
          <div className="sidebar-user">
            <div className="avatar">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span>{user.username}</span>
          </div>
        )}

        {/* Navigation */}
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/visible" onClick={() => setOpen(false)}>Visible Satellites</Link>
        <Link to="/info" onClick={() => setOpen(false)}>Info/Profile</Link>

        {user ? (
          <button onClick={handleLogout} className="sidebar-btn">Logout</button>
        ) : (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
          </>
        )}

        {/* Footer */}
        <div className="sidebar-footer">
          <a
            href="https://github.com/Jenil1217/Satellite-Tracker-Project"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repo
          </a>
          <span className="version">v1.0.0</span>
        </div>
      </div>

      {/* Click-away overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;
