// src/components/AddVacationModal.js
import React, { useState } from 'react';
import Modal from './Modal';
import './AddVacationModal.css';

const AddVacationModal = ({ isOpen, onClose, onSave, departments, employees }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    department: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedEmployee = employees.find(e => e.id === parseInt(formData.employeeId));
    onSave({
      ...formData,
      employeeId: parseInt(formData.employeeId),
      employeeName: selectedEmployee ? selectedEmployee.name : '',
      startDay: new Date(formData.startDate).getDate(),
      endDay: new Date(formData.endDate).getDate()
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить отпуск">
      <form onSubmit={handleSubmit} className="vacation-form">
        <div className="form-group">
          <label>Сотрудник</label>
          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">Выберите сотрудника</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name} ({departments.find(d => d.id === employee.department)?.name})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Дата начала</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
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
          <button type="button" className="cancel-btn" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="save-btn">
            Сохранить
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVacationModal;