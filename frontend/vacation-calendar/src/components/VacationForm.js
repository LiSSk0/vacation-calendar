import React, { useState } from 'react';
import './AddVacationModal.css';

const VacationForm = ({ onSubmit, user, onCancel }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError('Все поля обязательны для заполнения');
      return;
    }
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate > endDate) {
      setError('Дата окончания должна быть после даты начала');
      return;
    }
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays > 60) {
      setError('Максимальная продолжительность отпуска - 60 дней');
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      setError('Дата начала не может быть в прошлом');
      return;
    }
    
    setError('');
    onSubmit({
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason
    });
  };

  return (
    <form onSubmit={handleSubmit} className="vacation-form">
      {error && <div className="error-message">{error}</div>}
      
      {user && (
        <div className="form-group">
          <label>ФИО</label>
          <input 
            type="text" 
            disabled 
            value={user ? `${user.surname} ${user.name}` : 'Текущий пользователь'} 
          />
        </div>
      )}
      
      <div className="form-group">
        <label>Дата начала</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="form-group">
        <label>Дата окончания</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          min={formData.startDate || new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="form-group">
        <label>Причина</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Отмена
          </button>
        )}
        <button type="submit" className="save-btn">
          Сохранить
        </button>
      </div>
    </form>
  );
};

export default VacationForm;