import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(username, password);
      const token = response.data?.access_token || response.data?.access_token;
      if (token) {
        localStorage.setItem('token', token);
        window.location.href = '/manage';
      } else {
        setError('Не получен токен доступа');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Неверный логин или пароль';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="container">
        <div className="login-card glow-border">
          <h1 className="login-title glow-text">Вход</h1>
          <div className="login-line"></div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Логин</label>
              <input
                id="username"
                type="text"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Введите логин"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Введите пароль"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

