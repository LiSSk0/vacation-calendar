import sqlalchemy
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData, Table, Column, String, Date, Integer, LargeBinary, select
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from .models import User, Vacation, AuthEntry, Department
from werkzeug.security import generate_password_hash


SqlAlchemyBase = sqlalchemy.orm.declarative_base()


class DataBase:
    def __init__(self, db_name, user, password):
        # Создаём временное подключение к postgres
        connection = psycopg2.connect(user=user, password=password)
        connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)  # без автокоммита нельзя создавать БД,
                                                                    # т.к. открыта одна транзакция

        # Создаём БД, если ещё не создана
        cursor = connection.cursor()
        try:
            cursor.execute('create database ' + db_name)
        except psycopg2.errors.DuplicateDatabase:  # база данных уже создана
            pass
        finally:  # гарантированно закрываем временное подключение
            cursor.close()
            connection.close()

        # Создаём движок и подключение
        # дефолтные параметры: echo=False, pool_size=5, max_overflow=10, encoding='UTF-8'
        connection_link = "postgresql+psycopg2://" + user + ":" + password + "@localhost/" + db_name
        engine = create_engine(connection_link)
        metadata = MetaData()

        # Создаём таблицу пользователей
        self.users_table = Table('users', metadata,
                            Column('email', String, primary_key=True, nullable=False),
                            Column('name', String, nullable=False),
                            Column('surname', String, nullable=False),
                            Column('middlename', String, nullable=False),
                            Column('position', String),
                            Column('image', LargeBinary))

        # Создаём таблицу календаря
        self.calendar_table = Table('calendar', metadata,
                               Column('id', Integer, primary_key=True, autoincrement=True, nullable=False),
                               Column('email', String, nullable=False),
                               Column('fromDate', Date, nullable=False),
                               Column('toDate', Date, nullable=False),
                               Column('department', Integer, nullable=False),
                               Column('reason', String, nullable=False))

        # Создаём таблицу паролей пользователей
        self.auth_table = Table('auth', metadata,
                           Column('email', String, primary_key=True, nullable=False),
                           Column('password', String, nullable=False))

        # Создаём таблицу отделов
        self.departments_table = Table('departments', metadata,
                                  Column('id', Integer, primary_key=True, autoincrement=True, nullable=False),
                                  Column('name', String, nullable=False))

        # Инициализируем таблицы
        metadata.create_all(engine)
        self.engine = engine

    # Добавление пользователя в таблицу 'users'
    def add_user(self, email, name, surname, middlename, position=None, image=None):
        new_user = User(
            email=email,
            name=name,
            surname=surname,
            middlename=middlename,
            position=position,
            image=image
        )
        with Session(self.engine) as session:
            session.add(new_user)
            session.commit()

    # Добавление отпускс в таблицу 'calendar'
    def add_vacation(self, email, fromDate, toDate, department, reason):
        new_vacation = Vacation(
            email=email,
            fromDate=fromDate,
            toDate=toDate,
            department=department,
            reason=reason
        )
        with Session(self.engine) as session:
            session.add(new_vacation)
            session.commit()

    # Добавление данных аутентификации пользователя в таблицу 'auth'
    def add_auth(self, email, password):
        new_auth = AuthEntry(
            email=email,
            #password=generate_password_hash(password, method='pbkdf2:sha256')
            password=password
        )
        with Session(self.engine) as session:
            session.add(new_auth)
            session.commit()

    # Добавление отдела в таблицу 'departments'
    def add_department(self, name):
        new_department = Department(
            name=name
        )
        with Session(self.engine) as session:
            session.add(new_department)
            session.commit()

    # Получение всех пользователей
    def get_users(self):
        with Session(self.engine) as session:
            users = session.query(User).all()
            return users

    # Получение пользователя по почте
    def get_name_by_email(self, email):
        with Session(self.engine) as session:
            return session.query(User).filter_by(email=email).first()

    # Получение пароля по почте
    def get_password_by_email(self, email):
        with Session(self.engine) as session:
            return session.query(AuthEntry).filter_by(email=email).first()

    # Получение отпусков за указанный месяц и год
    def get_vacations(self, month, year):
        with Session(self.engine) as session:
            # Получаем все отпуска, которые пересекаются с указанным месяцем и годом
            vacations = session.query(Vacation).filter(
                sqlalchemy.or_(
                    sqlalchemy.and_(
                        sqlalchemy.extract('year', Vacation.fromDate) == year,
                        sqlalchemy.extract('month', Vacation.fromDate) == month
                    ),
                    sqlalchemy.and_(
                        sqlalchemy.extract('year', Vacation.toDate) == year,
                        sqlalchemy.extract('month', Vacation.toDate) == month
                    )
                )
            ).all()
            return vacations

    # Получение всех отделов
    def get_departments(self):
        with Session(self.engine) as session:
            departments = session.query(Department).all()
            return departments

    # Получение отпусков по email пользователя
    def get_vacations_by_email(self, email):
        with Session(self.engine) as session:
            vacations = session.query(Vacation).filter_by(email=email).all()
            return vacations

    def print(self, table):
        with Session(self.engine) as session:
            # Выполняем запрос к таблице, чтобы получить все записи
            result = session.execute(select(table)).fetchall()

            # Проверяем, есть ли результаты
            if result:
                # Печатаем названия колонок
                columns = [column.name for column in table.columns]
                print("\t".join(columns))

                # Печатаем все строки
                for row in result:
                    print("\t".join(str(value) for value in row))
            else:
                print("# Нет данных в таблице.")
