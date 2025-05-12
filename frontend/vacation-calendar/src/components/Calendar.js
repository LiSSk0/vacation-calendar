import React, { useState, useEffect } from 'react';
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
  const [processedVacations, setProcessedVacations] = useState([]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const formattedVacations = vacations.map(vacation => {
      // Унифицируем получение дат
      const startDate = new Date(vacation.startDate || vacation.fromDate);
      const endDate = new Date(vacation.endDate || vacation.toDate);
      
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1;

      if (
        (startYear < year || (startYear === year && startMonth <= month)) && 
        (endYear > year || (endYear === year && endMonth >= month))
      ) {
        const startDay = (startYear === year && startMonth === month) ? 
          startDate.getDate() : 1;
        
        const endDay = (endYear === year && endMonth === month) ? 
          endDate.getDate() : daysInMonth;

        return {
          ...vacation,
          startDay,
          endDay,
          employeeId: vacation.email,
          isPartial: !(startYear === year && startMonth === month && endYear === year && endMonth === month)
        };
      }
      return null;
    }).filter(v => v !== null);

    setProcessedVacations(formattedVacations);
  }, [vacations, month, year, daysInMonth]);
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setSelectedEmployee(null);
  };

  const handleEmployeeClick = (employee) => {
    const employeeVacation = processedVacations.find(v => v.employeeId === employee.email);
    setSelectedEmployee({
      ...employee,
      vacation: employeeVacation
    });
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesDepartment = selectedDepartment === 'all' || 
      employee.department === selectedDepartment;
    const matchesSearch = searchQuery === '' || 
      `${employee.surname} ${employee.name}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const handleMonthYearChange = (e) => {
    const [newYear, newMonth] = e.target.value.split('-');
    onMonthChange(parseInt(newMonth), parseInt(newYear));
  };

  // Форматирование даты для отображения в сайдбаре
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="header-left">
          <input
            type="month"
            value={`${year}-${String(month).padStart(2, '0')}`}
            onChange={handleMonthYearChange}
          />
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            <option value="all">Все отделы</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div className="header-right">
          <input
            type="text"
            placeholder="Поиск по ФИО"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={onAddClick}>
            + Добавить отпуск
          </button>
        </div>
      </div>

      <div className="calendar-main">
        <div className="calendar-grid-container">
          <div className="calendar-grid">
            <div className="grid-header">
              <div className="employee-header">Сотрудник</div>
              <div className="days-header">
                {days.map(day => (
                  <div key={day} className="day-header">
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {filteredEmployees.map(employee => {
  const employeeVacations = processedVacations.filter(v => 
    v.employeeId === employee.email || v.email === employee.email
  );
              return (
                <div 
                  key={employee.email}
                  className={`employee-row ${selectedEmployee?.email === employee.email ? 'selected' : ''}`}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <div className="employee-name">
                    {employee.surname} {employee.name}
                  </div>
                  <div className="days-row">
                    {days.map(day => {
                      // Проверяем все отпуска сотрудника
                      const isVacationDay = employeeVacations.some(vacation => 
                        day >= vacation.startDay && day <= vacation.endDay
                      );
                      const isStart = employeeVacations.some(vacation => 
                        day === vacation.startDay && !vacation.isPartial
                      );
                      const isEnd = employeeVacations.some(vacation => 
                        day === vacation.endDay && !vacation.isPartial
                      );

                      return (
                        <div
                          key={day}
                          className={`day-cell ${isVacationDay ? 'vacation' : ''} ${isStart ? 'vacation-start' : ''} ${isEnd ? 'vacation-end' : ''}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedEmployee?.vacation && (
          <div className="vacation-sidebar">
            <h3>{selectedEmployee.surname} {selectedEmployee.name}</h3>
            <div className="vacation-details">
              <p><strong>Отдел:</strong> {departments.find(d => d.id === selectedEmployee.department)?.name}</p>
              <p><strong>Период:</strong> {formatDate(selectedEmployee.vacation.fromDate)} - {formatDate(selectedEmployee.vacation.toDate)}</p>
              <p><strong>Причина:</strong> {selectedEmployee.vacation.reason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;