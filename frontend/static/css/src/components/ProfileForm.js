import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileForm = ({ user, onSubmit }) => {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    position: user.position || '',
    department: user.department || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Должность</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
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
          <option value="dev">Разработка</option>
          <option value="qa">Тестирование</option>
          <option value="marketing">Маркетинг</option>
          <option value="hr">HR</option>
        </select>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-btn">Сохранить</button>
      </div>
    </form>
  );
};

export default ProfileForm;