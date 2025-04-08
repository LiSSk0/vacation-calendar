import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email && password) {
      const userData = {
        email,
        name: 'Иван',
        surname: 'Иванов',
        middlename: 'Иванович',
        position: 'Разработчик'
      };
      login(userData);
      navigate('/');
    } else {
      setError('Пожалуйста, заполните все поля');
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