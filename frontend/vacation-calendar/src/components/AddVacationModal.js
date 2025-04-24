import React, { useState } from 'react';
import Modal from './Modal';
import './AddVacationModal.css';

const AddVacationModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
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
    
    if (!user?.department) {
      alert('Для добавления отпуска необходимо указать отдел в личном кабинете');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить отпуск">
      <form onSubmit={handleSubmit} className="vacation-form">
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