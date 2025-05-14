import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from './constants';

const ProfileForm = ({ user, onSubmit }) => {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    position: user.position || '',
    department: user.department || DEPARTMENTS[0]?.id || ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.department) {
      setError('Отдел обязателен для заполнения');
      return;
    }
    
    try {
      await updateUser(formData);
      onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Ошибка при обновлении профиля');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Должность</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Введите должность"
        />
      </div>
      
      <div className="form-group">
        <label>Отдел</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Выберите отдел</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={() => onSubmit(null)}>
          Отмена
        </button>
        <button type="submit" className="btn-primary">
          Сохранить
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;