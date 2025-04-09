# Веб-приложение “Календарь отпусков”
**Календарь отпусков** — это веб-приложение для управления отпусками сотрудников. Оно позволяет отслеживать график отпусков, предотвращать конфликты дат и упрощает процесс планирования.


## Технологии
- Backend: Python
- Frontend: JavaScript (React)
- База данных: PostgreSQL


## Основной функционал
- Просмотр и управление графиком отпусков
- Поиск и фильтрация отпусков
- Авторизация и контроль доступа


## Установка и запуск
**1. Клонируйте репозиторий:**
```bash
git clone https://github.com/LiSSk0/vacation-calendar.git
cd vacation-calendar
```

**2. Установите [Python](https://www.python.org/downloads/).**  
При установке нажимаем галочку напротив "add to PATH"

**3. Установите [Node.js](https://nodejs.org/en)**  
При установке нажимаем галочку напротив "add to PATH"

**4. Настройте виртуальное окружение и установите зависимости:**  
Перейдите в папку проекта.  

Установите Backend (Python):
```bash
cd backend
python -m venv venv  # создание виртуального окружения
source venv/bin/activate  # Для macOS/Linux
venv\Scripts\activate     # Для Windows
pip install -r requirements.txt
```
Установите Frontend (JavaScript):
```bash
cd ..  # возврат в корневую папку проекта
cd frontend/vacation-calendar  # переход в папку React-приложения
npm install  # устанавливаем зависимости
```

**5. Укажите данные для подключения к БД PostgreSQL в файле .env**  
Шаблон находится в файле .env.example

**6. Запустите backend в корневой папке проекта:**
```bash
python backend/src/main.py
```
**7. Запустите frontend:**
```bash
cd frontend/vacation-calendar  # переход в папку React-приложения
npm start  # запуск сайта
```
Приложение запустится по адресу http://localhost:3000


## Контакты для связи
**Мария (Team Leader / Frontend):**  
Telegram: [@koomorebiiii](https://t.me/koomorebiiii)  
Email: masha.mashchalkina@mail.ru

**Елизавета (Backend):**  
Telegram: [@lissk0](https://t.me/lissk0)  
Email: lissk0@mail.ru

**Ксения (Backend):**  
Telegram: [@miss_balba](https://t.me/miss_balba)

**Михаил (Frontend):**  
Telegram: [@mkurapov](https://t.me/mkurapov)
