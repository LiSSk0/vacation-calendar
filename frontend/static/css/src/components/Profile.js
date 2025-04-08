import React, { useState } from 'react';

const Profile = ({ user, onUpdateProfile, departments }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    position: user?.position || '',
    department: user?.department || departments[0]?.id || '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-info">
        <div className="profile-image">
          {user?.image ? (
            <img src={user.image} alt="Profile" />
          ) : (
            <div className="profile-image-placeholder">
              {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
            </div>
          )}
        </div>
        <div className="profile-details">
          <p><strong>Имя:</strong> {user?.name}</p>
          <p><strong>Фамилия:</strong> {user?.surname}</p>
          <p><strong>Отчество:</strong> {user?.middlename}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {user?.position && <p><strong>Должность:</strong> {user.position}</p>}
          {user?.department && (
            <p>
              <strong>Отдел:</strong> {
                departments.find(d => d.id === user.department)?.name || 'Не указан'
              }
            </p>
          )}
        </div>
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Должность:</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Отдел:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Фото профиля:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Сохранить</button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setEditMode(false)}
            >
              Отмена
            </button>
          </div>
        </form>
      ) : (
        <button 
          className="btn-primary" 
          onClick={() => setEditMode(true)}
        >
          Редактировать профиль
        </button>
      )}
    </div>
  );
};

export default Profile;