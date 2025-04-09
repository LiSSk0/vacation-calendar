from sqlalchemy import Column, String, Integer, Date, LargeBinary
from sqlalchemy.orm import declarative_base

# Базовый класс для моделей
Base = declarative_base()


# Класс для таблицы пользователей
class User(Base):
    __tablename__ = 'users'

    email = Column(String, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    middlename = Column(String, nullable=False)
    position = Column(String, nullable=True)
    image = Column(LargeBinary, nullable=True)

    def __init__(self, email, name, surname, middlename, position=None, image=None):
        self.email = email
        self.name = name
        self.surname = surname
        self.middlename = middlename
        self.position = position
        self.image = image


# Класс для таблицы календаря
class Vacation(Base):
    __tablename__ = 'calendar'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    email = Column(String, nullable=False)
    fromDate = Column(Date, nullable=False)
    toDate = Column(Date, nullable=False)
    department = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)

    def __init__(self, email, fromDate, toDate, department, reason):
        self.email = email
        self.fromDate = fromDate
        self.toDate = toDate
        self.department = department
        self.reason = reason


# Класс для таблицы паролей пользователей
class AuthEntry(Base):
    __tablename__ = 'auth'

    email = Column(String, primary_key=True, nullable=False)
    password = Column(String, nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password = password


# Класс для таблицы отделов
class Department(Base):
    __tablename__ = 'departments'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)

    def __init__(self, name):
        self.name = name
