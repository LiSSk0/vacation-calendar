import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ 
  month, 
  year, 
  onMonthChange, 
  onAddClick,
  vacations,
  departments,
  employees
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setSelectedEmployee(null);
  };

  const handleEmployeeClick = (employee) => {
    const employeeVacation = vacations.find(v => v.employeeId === employee.id);
    setSelectedEmployee({
      ...employee,
      vacation: employeeVacation
    });
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesDepartment = selectedDepartment === 'all' || 
      employee.department === selectedDepartment;
    const matchesSearch = searchQuery === '' || 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const handleMonthYearChange = (e) => {
    const [newYear, newMonth] = e.target.value.split('-');
    onMonthChange(parseInt(newMonth), parseInt(newYear));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="date-selector">
          <input
            type="month"
            value={`${year}-${String(month).padStart(2, '0')}`}
            onChange={handleMonthYearChange}
          />
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Введите запрос"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-vacation-btn" onClick={onAddClick}>
          + Добавить информацию
        </button>
      </div>

      <div className="calendar-content">
        <div className="employees-list">
          <select 
            className="department-select"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            <option value="all">Все отделы</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          {filteredEmployees.map(employee => (
            <div 
              key={employee.id}
              className={`employee-name ${
                selectedEmployee?.id === employee.id ? 'selected' : ''
              }`}
              onClick={() => handleEmployeeClick(employee)}
            >
              {employee.name}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          <div className="calendar-days">
            {days.map(day => (
              <div key={day} className="calendar-day">
                {day}
              </div>
            ))}
          </div>

          {filteredEmployees.map(employee => {
            const vacation = vacations.find(v => v.employeeId === employee.id);
            return (
              <div key={employee.id} className="calendar-row">
                {days.map(day => {
                  const isVacation = vacation && 
                    day >= vacation.startDay && 
                    day <= vacation.endDay;
                  return (
                    <div
                      key={day}
                      className={`calendar-cell ${isVacation ? 'vacation' : ''}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {selectedEmployee?.vacation && (
          <div className="vacation-info">
            <h3>{selectedEmployee.name}</h3>
            <p>Причина: {selectedEmployee.vacation.reason}</p>
            <p>Период: {selectedEmployee.vacation.startDay}-{selectedEmployee.vacation.endDay} {monthNames[month-1]} {year}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const monthNames = [
  'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
  'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
];

export default Calendar;