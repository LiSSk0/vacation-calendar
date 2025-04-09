export const generateCalendarData = (month, year, department, vacations) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    const filteredVacations = department 
      ? vacations.filter(v => v.department === parseInt(department))
      : vacations;
    
    const employees = {};
    
    filteredVacations.forEach(vacation => {
      if (!employees[vacation.email]) {
        employees[vacation.email] = {
          name: vacation.name,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
          vacationDays: [],
        };
      }
      
      const fromDate = new Date(vacation.fromDate);
      const toDate = new Date(vacation.toDate);
      
      if (fromDate.getMonth() + 1 === month && fromDate.getFullYear() === year) {
        for (let day = fromDate.getDate(); day <= Math.min(toDate.getDate(), daysInMonth); day++) {
          if (!employees[vacation.email].vacationDays.includes(day)) {
            employees[vacation.email].vacationDays.push(day);
          }
        }
      }
    });
    
    return {
      days,
      employees: Object.values(employees),
    };
  };
