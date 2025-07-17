import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useState} from 'react';
import Home from './pages/Home.jsx';
import Info from './pages/Infoo.jsx';
import Visible from './pages/Visible.jsx'; // coming next
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
// src/index.jsx or App.jsx
import './App.css';
import Sidebar from './components/Sidebar';

const App = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <AuthProvider>
     <Router>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info" element={<Info />} />
          <Route path="/visible" element={<Visible />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;
