from flask import request, jsonify
from db.validation import is_valid_email, is_valid_name
from werkzeug.security import generate_password_hash, check_password_hash


def register_routes(app):
    # Получение списка пользователей
    @app.route('/api/users', methods=['GET'])
    def get_users():
        try:
            # Получаем всех пользователей из БД
            users = app.db.get_users()

            # Формируем JSON
            users_json = [
                {
                    'email': user.email,
                    'name': user.name,
                    'surname': user.surname,
                    'middlename': user.middlename,
                    'position': user.position,
                    'image': user.image.decode('utf-8') if user.image else None
                }
                for user in users
            ]

            return jsonify(users_json)
        except Exception as e:
            print(f"# Ошибка при получении списка пользователей: {e}")
            return jsonify({'success': False, 'error': 'Ошибка сервера при получении списка пользователей'}), 500

    # Проверка пароля
    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            email = data.get('email')
            # print(type(data.get('password')))
            # password=generate_password_hash(data.get('password'), method='pbkdf2:sha256')
            # print(password)
            password = data.get('password')

            # Проверка на наличие почты и пароля
            if not email or not password:
                return jsonify({'success': False, 'error': 'Отсутствует логин или пароль'}), 400

            # Получаем пользователя по почте из БД
            user = app.db.get_name_by_email(email)
            password_storage = app.db.get_password_by_email(email)


            # Проверяем, что запрошенный пользователь есть в БД
            if not user:
                return jsonify({'success': False, 'error': 'Пользователь не найден'}), 404

            # Проверяем, подходит ли пароль
            stored_password = password_storage.password
            print(stored_password)

            # if not check_password_hash(stored_password, password):
            if stored_password != password:
                return jsonify({'success': False, 'error': 'Неверный пароль'}), 401

            return jsonify({
                'success': True,
                'user': {
                    'email': email,
                    'name': user.name,
                    'surname': user.surname,
                    'middlename': user.middlename,
                    'position': None,
                    'image': None
                }
            }), 201
        except Exception as e:
            print(f"# Ошибка при авторизации: {e}")
            return jsonify({'success': False, 'error': 'Ошибка сервера при авторизации'}), 500

    # Добавление отпуска
    @app.route('/api/add_vacation', methods=['POST'])
    def add_vacation():
        try:
            data = request.get_json()

            app.db.add_vacation(
                data.get('email'),
                data.get('fromDate'),
                data.get('toDate'),
                1,# TODO РАЗОБРАТЬСЯ ПОЧЕМУ ТУТ ДОЛЖЕН БЫТЬ INT А С ФРОНТА ЕДУТ СТРИНГИ #data.get('department'),
                data.get('reason')
            )
            return jsonify({'success': True})
        except Exception as e:
            print(f"# Ошибка при добавлении отпуска: {e}")
            return jsonify({'success': False, 'error': 'Ошибка сервера при добавлении отпуска'}), 500

    # Регистрация нового пользователя
    @app.route('/api/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            email = data.get('email', '').strip()
            password = data.get('password', '')
            name = data.get('name', '').strip()
            surname = data.get('surname', '').strip()
            middlename = data.get('middlename', '').strip()

            # Базовая валидация
            if not (email and password and name and surname and middlename):
                return jsonify({'success': False, 'error': 'Введены неверные данные'}), 400
            if not is_valid_email(email):
                return jsonify({'success': False, 'error': 'Неверная почта'}), 400

            # Проверяем, что пользователь ещё не существует
            if app.db.get_name_by_email(email):
                return jsonify({'success': False, 'error': 'Пользователь уже существует'}), 409

            # Создаём запись в users и auth
            app.db.add_user(email, name, surname, middlename)
            app.db.add_auth(email, password)

            return jsonify({
                'success': True,
                'user': {
                    'email': email,
                    'name': name,
                    'surname': surname,
                    'middlename': middlename,
                    'position': None,
                    'image': None
                    }
                }), 201
        except Exception as e:
            print(f"# Ошибка при регистрации: {e}")
            return jsonify({'success': False, 'error': 'Ошибка сервера при регистрации пользователя'}), 500

    # Получение списка отпусков
    @app.route('/api/vacations', methods=['GET'])
    def get_vacations():
        try:
            # Получаем параметры месяца и года из запроса
            month = request.args.get('month', type=int)
            year = request.args.get('year', type=int)

            # Валидация параметров
            if not (month and year):
                return jsonify({'success': False,
                                'error': 'Некорректные данные месяц/год'}), 400

            # Получаем отпуска из БД
            vacations = app.db.get_vacations(month, year)

            # Формируем JSON
            vacations_json = [
                {
                    'id': vacation.id,
                    'email': vacation.email,
                    'fromDate': vacation.fromDate.isoformat(),
                    'toDate': vacation.toDate.isoformat(),
                    'department': vacation.department,
                    'reason': vacation.reason,
                }
                for vacation in vacations
            ]

            return jsonify(vacations_json)
        except Exception as e:
            print(f"# Ошибка при получении списка отпусков: {e}")
            return jsonify({'success': False,
                            'error': 'Ошибка сервера при получении списка отпусков'}), 500

    # Получение списка отделов
    @app.route('/api/departments', methods=['GET'])
    def get_departments():
        try:
            # Получаем отделы из БД
            departments = app.db.get_departments()

            # Формируем JSON
            departments_json = [
                {
                    'id': department.id,
                    'name': department.name,
                }
                for department in departments
            ]

            return jsonify(departments_json)
        except Exception as e:
            print(f"# Ошибка при получении списка отделов: {e}")
            return jsonify({'success': False,
                            'error': 'Ошибка сервера при получении списка отделов'}), 500


    @app.route('/api/users/<email>', methods=['DELETE'])
    def delete_user(email):
        try:
            if not app.db.get_name_by_email(email):
                return jsonify({'success': False, 'error': 'Пользователь не найден'}), 404

            if app.db.delete_user(email):
                return jsonify({'success': True}), 200
            else:
                return jsonify({'success': False, 'error': 'Ошибка при удалении пользователя'}), 500
        except Exception as e:
            print(f"# Ошибка при удалении пользователя: {e}")
            return jsonify({'success': False, 'error': 'Ошибка сервера при удалении пользователя'}), 500

