import React, { useState } from 'react';

const ProfileForm = ({ user, onSubmit }) => {
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
        >
          <option value="1">Отдел разработки</option>
          <option value="2">Отдел тестирования</option>
          <option value="3">Отдел маркетинга</option>
          <option value="4">HR отдел</option>
        </select>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-btn">Сохранить</button>
      </div>
    </form>
  );
};

export default ProfileForm;