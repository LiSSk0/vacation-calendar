import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

const ProtectedRoute = ({ children, requireDepartment = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireDepartment && !user.department) {
    return <Navigate to="/profile?require_department=true" replace />;
  }

  return children;
};

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVacationChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage refreshKey={refreshKey} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage onVacationChange={handleVacationChange} />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/vacations" 
              element={
                <ProtectedRoute requireDepartment>
                  <HomePage refreshKey={refreshKey} />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;