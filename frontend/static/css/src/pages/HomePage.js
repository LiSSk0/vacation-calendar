// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import AddVacationModal from '../components/AddVacationModal';
import { useAuth } from '../context/AuthContext';
import { getVacations, getDepartments, getUsers, addVacation } from '../api';

const HomePage = () => {
  const currentDate = new Date();
  const { user } = useAuth();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vacations, setVacations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vacationsData, departmentsData, employeesData] = await Promise.all([
          getVacations(month, year),
          getDepartments(),
          getUsers()
        ]);
        setVacations(vacationsData);
        setDepartments(departmentsData);
        setEmployees(employeesData.map(e => ({
          id: e.email,
          name: `${e.surname} ${e.name} ${e.middlename}`,
          department: e.department
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleAddVacation = async (formData) => {
    try {
      if (!user?.department) {
        alert('Для добавления отпуска необходимо указать отдел в личном кабинете');
        return;
      }

      const newVacation = await addVacation({
        email: user.email,
        fromDate: formData.startDate,
        toDate: formData.endDate,
        department: user.department,
        reason: formData.reason
      });

      setVacations(prev => [...prev, newVacation]);
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="home-page">
      <Calendar 
        month={month}
        year={year}
        onMonthChange={handleMonthChange}
        onAddClick={() => {
          if (!user) {
            alert('Для добавления отпуска необходимо авторизоваться');
            return;
          }
          if (!user.department) {
            alert('Для добавления отпуска необходимо указать отдел в личном кабинете');
            return;
          }
          setIsAddModalOpen(true);
        }}
        vacations={vacations}
        departments={departments}
        employees={employees}
      />

      <AddVacationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddVacation}
        user={user}
      />
    </div>
  );
};

export default HomePage;