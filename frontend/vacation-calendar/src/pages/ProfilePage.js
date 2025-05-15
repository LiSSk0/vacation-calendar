import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import ProfileForm from '../components/ProfileForm';
import VacationForm from '../components/VacationForm';
import './AuthProfile.css';

const ProfilePage = () => {
  const { deleteVacation } = useAuth(); 
  const { user, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vacations, setVacations] = useState([]);
  const [nearestVacation, setNearestVacation] = useState(null);
  const [daysUntilVacation, setDaysUntilVacation] = useState(null);
  const [currentVacation, setCurrentVacation] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadVacations = () => {
      try {
        const savedVacations = JSON.parse(localStorage.getItem(`vacations_${user.email}`)) || [];
        const normalizedVacations = savedVacations.map(v => ({
          ...v,
          startDate: v.startDate || v.fromDate,
          endDate: v.endDate || v.toDate
        }));

        setVacations(normalizedVacations);

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const current = normalizedVacations.find(v => {
          const start = new Date(v.startDate);
          const end = new Date(v.endDate);
          return now >= start && now <= end;
        });

        if (current) {
          setCurrentVacation(current);
          return;
        }

        const upcoming = normalizedVacations
          .filter(v => new Date(v.startDate) > now)
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        if (upcoming.length > 0) {
          const nearest = upcoming[0];
          setNearestVacation(nearest);
          const daysDiff = Math.ceil((new Date(nearest.startDate) - now) / (1000 * 60 * 60 * 24));
          setDaysUntilVacation(daysDiff);
        }
      } catch (error) {
        console.error('Ошибка загрузки отпусков:', error);
      }
    };

    if (user?.email) {
      loadVacations();
    }
  }, [user]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      await updateUser(updatedData);
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  };

  const handleAddVacation = (vacationData) => {
    const newVacation = {
      id: Date.now(),
      startDate: vacationData.startDate,
      endDate: vacationData.endDate,
      reason: vacationData.reason,
      email: user.email,
      department: user.department,
      fromDate: vacationData.startDate,
      toDate: vacationData.endDate
    };

    const updatedVacations = [...vacations, newVacation];
    localStorage.setItem(`vacations_${user.email}`, JSON.stringify(updatedVacations));
    
    setVacations(updatedVacations);
    
    const now = new Date();
    const startDate = new Date(newVacation.startDate);
    const endDate = new Date(newVacation.endDate);

    if (now >= startDate && now <= endDate) {
      setCurrentVacation(newVacation);
      setNearestVacation(null);
      setDaysUntilVacation(0);
    } else if (startDate > now && (!nearestVacation || startDate < new Date(nearestVacation.startDate))) {
      setNearestVacation(newVacation);
      setDaysUntilVacation(Math.ceil((startDate - now) / (1000 * 60 * 60 * 24)));
    }

    setIsVacationModalOpen(false);
  };

const handleDeleteVacation = async (vacationId) => {
  try {
    setDeleteError('');
    setIsDeleting(true);
    
    await deleteVacation(vacationId);

    const updatedVacations = vacations.filter(v => v.id !== vacationId);
    localStorage.setItem(`vacations_${user.email}`, JSON.stringify(updatedVacations));
    setVacations(updatedVacations);

    // Обновляем статус текущего/ближайшего отпуска
    const now = new Date();
    const current = updatedVacations.find(v => {
      const start = new Date(v.startDate);
      const end = new Date(v.endDate);
      return now >= start && now <= end;
    });

    if (current) {
      setCurrentVacation(current);
      setNearestVacation(null);
      setDaysUntilVacation(0);
    } else {
      setCurrentVacation(null);
      const upcoming = updatedVacations
        .filter(v => new Date(v.startDate) > now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      if (upcoming.length > 0) {
        const nearest = upcoming[0];
        setNearestVacation(nearest);
        setDaysUntilVacation(Math.ceil((new Date(nearest.startDate) - now) / (1000 * 60 * 60 * 24)));
      } else {
        setNearestVacation(null);
        setDaysUntilVacation(null);
      }
    }
  } catch (error) {
    console.error('Ошибка при удалении отпуска:', error);
    setDeleteError(error.message);
  } finally {
    setIsDeleting(false);
  }
};

  const handleDeleteAccount = async () => {
    setDeleteError('');
    setIsDeleting(true);
    try {
      const success = await deleteAccount(user.email);
      if (success) {
        navigate('/login');
      } else {
        setDeleteError('Не удалось удалить аккаунт');
      }
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
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
        <h2>Информация об отпусках</h2>
        <div className="vacations-card">
          {currentVacation ? (
            <div className="vacation-status current">
              <h3>Вы в отпуске!</h3>
              <p>Период: {formatDate(currentVacation.startDate)} - {formatDate(currentVacation.endDate)}</p>
              <p>Причина: {currentVacation.reason}</p>
            </div>
          ) : nearestVacation ? (
            <div className="vacation-status upcoming">
              <h3>Ближайший отпуск</h3>
              <p>Период: {formatDate(nearestVacation.startDate)} - {formatDate(nearestVacation.endDate)}</p>
              <p>Причина: {nearestVacation.reason}</p>
              <div className="days-counter">
                До отпуска: {daysUntilVacation} {daysUntilVacation === 1 ? 'день' : daysUntilVacation < 5 ? 'дня' : 'дней'}
              </div>
            </div>
          ) : (
            <div className="vacation-status none">
              <h3>Нет запланированных отпусков</h3>
            </div>
          )}

          <h3>Все отпуска:</h3>
          {vacations.length > 0 ? (
            <ul className="vacations-list">
              {vacations.map(vacation => (
                <li key={vacation.id}>
                  <div className="vacation-item">
                    <div>
                      <strong>{formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}</strong>
                      <p>Причина: {vacation.reason}</p>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={() => {
                        if (window.confirm('Вы уверены, что хотите удалить этот отпуск?')) {
                          handleDeleteVacation(vacation.id);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Удаление...' : 'Удалить'}
                    </button>
                  </div>
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
            Добавить отпуск
          </button>
        </div>
      </div>

      <div className="danger-zone">
        <h2>Удалить аккаунт</h2>
        <div className="danger-zone-content">
          <p>Удаление аккаунта приведет к потере всех данных.</p>
          <button 
            className="btn-danger"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
          >
            Удалить
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Подтверждение удаления"
      >
        <div className="delete-confirmation">
          <p>Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.</p>
          {deleteError && <div className="error-message">{deleteError}</div>}
          <div className="modal-actions">
            <button 
              className="btn-secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Отмена
            </button>
            <button 
              className="btn-danger"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Удаление...' : 'Да, удалить'}
            </button>
          </div>
        </div>
      </Modal>

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
          user={user}
          onSubmit={handleAddVacation}
          onCancel={() => setIsVacationModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProfilePage;