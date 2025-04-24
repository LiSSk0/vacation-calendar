// src/components/AddVacationForm.js
import React, { useState } from 'react';

const AddVacationForm = ({ onSubmit, user }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError('Все поля обязательны для заполнения');
      return;
    }
    
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Дата окончания должна быть после даты начала');
      return;
    }
    
    setError('');
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="vacation-form">
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label>Дата начала:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Дата окончания:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Причина:</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn-primary">Добавить отпуск</button>
    </form>
  );
};

export default AddVacationForm;