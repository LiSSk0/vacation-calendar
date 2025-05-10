// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuthProfile.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, passwordHint } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <h2>Вход в систему</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordHint && (
            <div className="password-hint">
              <small>{passwordHint}</small>
            </div>
          )}
        </div>
        <button type="submit" className="btn-primary">Войти</button>
      </form>
      <p>
        Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
      </p>
    </div>
  );
};

export default LoginPage;