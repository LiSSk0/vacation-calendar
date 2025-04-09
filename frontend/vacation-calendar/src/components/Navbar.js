import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">Календарь отпусков</Link>
        </div>
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <span className="navbar-greeting">Добрый день, {user.name}!</span>
              <Link to="/profile" className="profile-link">
                <span className="profile-icon">👤</span>
              </Link>
              <button onClick={logout} className="logout-btn">Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Вход</Link>
              <Link to="/register" className="navbar-link register-btn">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;