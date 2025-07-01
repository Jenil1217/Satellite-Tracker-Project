import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Info from './pages/Infoo.jsx';
import Visible from './pages/Visible.jsx'; // coming next
import Navbar from './components/Navbar.jsx';
// src/index.jsx or App.jsx
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/visible" element={<Visible />} />
      </Routes>
    </Router>
  );
};

export default App;
