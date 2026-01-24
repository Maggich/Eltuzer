import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Landing from './pages/Landing';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing' || location.pathname === '/offer';

  return (
    <div className="App">
      {!isLandingPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/offer" element={<Landing />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/manage" element={<Admin />} />
        <Route path="/admin" element={<Navigate to="/manage" replace />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isLandingPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

