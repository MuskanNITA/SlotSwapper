import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Requests from './pages/Requests';
import { AuthContext } from './context/AuthContext';

function Private({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header style={{ marginBottom: 12 }}>
          <h1 style={{ margin: 0 }}>SlotSwapper</h1>
          <nav style={{ marginTop: 8 }}>
            <Link to="/">Dashboard</Link> | <Link to="/market">Marketplace</Link> | <Link to="/requests">Requests</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/" element={<Private><Dashboard/></Private>} />
          <Route path="/market" element={<Private><Marketplace/></Private>} />
          <Route path="/requests" element={<Private><Requests/></Private>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
