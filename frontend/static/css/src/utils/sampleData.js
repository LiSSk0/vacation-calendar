export const generateSampleData = () => {
    const departments = [
      { id: 1, name: 'Отдел разработки' },
      { id: 2, name: 'Отдел тестирования' },
      { id: 3, name: 'Отдел маркетинга' },
      { id: 4, name: 'HR отдел' }
    ];
  
    const vacations = [
      {
        id: 1,
        email: 'user1@example.com',
        name: 'Иванов Иван',
        fromDate: '2025-03-10',
        toDate: '2025-03-15',
        department: 1,
        reason: 'Ежегодный отпуск'
      },
      {
        id: 2,
        email: 'user2@example.com',
        name: 'Петров Петр',
        fromDate: '2025-03-05',
        toDate: '2025-03-12',
        department: 1,
        reason: 'Отпуск за свой счет'
      },
      {
        id: 3,
        email: 'user3@example.com',
        name: 'Сидорова Анна',
        fromDate: '2025-03-20',
        toDate: '2025-03-25',
        department: 2,
        reason: 'Ежегодный отпуск'
      }
    ];
  
    return { departments, vacations };
  };