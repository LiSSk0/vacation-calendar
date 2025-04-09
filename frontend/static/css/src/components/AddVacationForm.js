import React, { useState } from 'react';

const AddVacationForm = ({ onSubmit, departments }) => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    department: departments[0]?.id || '',
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
    <form onSubmit={handleSubmit} className="vacation-form">
      <div className="form-group">
        <label>Дата начала:</label>
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Дата окончания:</label>
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Отдел:</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
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