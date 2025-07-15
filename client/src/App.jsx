import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Info from './pages/Infoo.jsx';
import Visible from './pages/Visible.jsx'; // coming next
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
// src/index.jsx or App.jsx
import './App.css';

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/visible" element={<Visible />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
