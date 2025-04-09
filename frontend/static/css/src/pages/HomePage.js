import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import AddVacationModal from '../components/AddVacationModal';

const HomePage = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vacations, setVacations] = useState([
    { 
      id: 1, 
      employeeId: 7, 
      employeeName: 'Васильев С.С',
      startDay: 5, 
      endDay: 15, 
      reason: 'Отпуск по болезни',
      department: 'hr'
    }
  ]);

  // Пример данных
  const departments = [
    { id: 'dev', name: 'Разработка' },
    { id: 'qa', name: 'Тестирование' },
    { id: 'marketing', name: 'Маркетинг' },
    { id: 'hr', name: 'HR' }
  ];

  const employees = [
    { id: 1, name: 'Иванов И.И', department: 'dev' },
    { id: 2, name: 'Смирнов С.С', department: 'dev' },
    { id: 3, name: 'Соколов С.С', department: 'qa' },
    { id: 4, name: 'Кузнецов К.К', department: 'qa' },
    { id: 5, name: 'Попова П.А', department: 'marketing' },
    { id: 6, name: 'Петрова А.П', department: 'marketing' },
    { id: 7, name: 'Васильев С.С', department: 'hr' },
    { id: 8, name: 'Магомедов М.М', department: 'hr' },
    { id: 9, name: 'Алиев А.В', department: 'dev' },
    { id: 10, name: 'Волков С.С', department: 'qa' },
    { id: 11, name: 'Орлова С.С', department: 'marketing' }
  ];

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleAddVacation = (newVacation) => {
    setVacations(prev => [
      ...prev,
      {
        ...newVacation,
        id: Math.max(...prev.map(v => v.id), 0) + 1
      }
    ]);
  };

  return (
    <div className="home-page">
      <Calendar 
        month={month}
        year={year}
        onMonthChange={handleMonthChange}
        onAddClick={() => setIsAddModalOpen(true)}
        vacations={vacations}
        departments={departments}
        employees={employees}
      />

      <AddVacationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddVacation}
        departments={departments}
        employees={employees}
      />
    </div>
  );
};

export default HomePage;