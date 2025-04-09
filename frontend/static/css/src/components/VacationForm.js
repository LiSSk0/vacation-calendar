import React, { useState } from 'react';

const VacationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    reason: ''
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
        <label>ФИО</label>
        <input type="text" disabled value="Текущий пользователь" />
      </div>
      
      <div className="form-group">
        <label>E-mail</label>
        <input type="email" disabled value="it_is_your@mail.ru" />
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
      
      <div className="form-group">
        <label>Дата начала</label>
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Дата окончания</label>
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
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
        <button type="submit" className="submit-btn">Сохранить</button>
      </div>
    </form>
  );
};

export default VacationForm;