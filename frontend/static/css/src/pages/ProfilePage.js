import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ProfileForm from '../components/ProfileForm';
import VacationForm from '../components/VacationForm';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);
  const [vacations, setVacations] = useState([
    { id: 1, fromDate: '2025-03-04', toDate: '2025-03-18', reason: 'отпуск по болезни' }
  ]);

  const handleUpdateProfile = (updatedData) => {
    // Логика обновления профиля
    setIsProfileModalOpen(false);
  };

  const handleAddVacation = (vacationData) => {
    const newVacation = {
      id: vacations.length + 1,
      ...vacationData
    };
    setVacations([...vacations, newVacation]);
    setIsVacationModalOpen(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-section">
        <h1>Мой профиль</h1>
        
        <div className="profile-card">
          <h2>Личные данные</h2>
          
          <div className="profile-field">
            <h3>Имя</h3>
            <p>{user.name}</p>
          </div>
          
          <div className="profile-field">
            <h3>Email</h3>
            <p>{user.email}</p>
          </div>
          
          <div className="profile-field">
            <h3>Должность</h3>
            <p>{user.position || 'Не указана'}</p>
          </div>
          
          <div className="profile-field">
            <h3>Отдел</h3>
            <p>{user.department || 'Не указан'}</p>
          </div>
          
          <button 
            className="edit-profile-btn"
            onClick={() => setIsProfileModalOpen(true)}
          >
            Настройки
          </button>
        </div>
      </div>

      <div className="vacations-section">
        <h2>Общая информация</h2>
        
        <div className="vacations-card">
          <h3>Следующие отпуска:</h3>
          
          {vacations.length > 0 ? (
            <ul className="vacations-list">
              {vacations.map(vacation => (
                <li key={vacation.id}>
                  <strong>{vacation.fromDate} - {vacation.toDate}</strong>
                  <p>Причина: {vacation.reason}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет запланированных отпусков</p>
          )}
          
          <button 
            className="add-vacation-btn"
            onClick={() => setIsVacationModalOpen(true)}
          >
            Добавить отпуск ▼
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        title="Редактировать профиль"
      >
        <ProfileForm 
          user={user} 
          onSubmit={handleUpdateProfile} 
        />
      </Modal>

      <Modal 
        isOpen={isVacationModalOpen} 
        onClose={() => setIsVacationModalOpen(false)}
        title="Добавить отпуск"
      >
        <VacationForm 
          onSubmit={handleAddVacation} 
        />
      </Modal>
    </div>
  );
};

export default ProfilePage;