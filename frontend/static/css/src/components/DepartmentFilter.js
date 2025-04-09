import React from 'react';

const DepartmentFilter = ({ departments, selectedDepartment, onSelect }) => {
  return (
    <div className="department-filter">
      <label>Отдел:</label>
      <select
        value={selectedDepartment}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Все отделы</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>{dept.name}</option>
        ))}
      </select>
    </div>
  );
};

export default DepartmentFilter;