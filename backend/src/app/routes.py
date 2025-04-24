from flask import request, jsonify


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
            password = data.get('password')

            # Проверка на наличие почты и пароля
            if not email or not password:
                return jsonify({'success': False, 'error': 'Missing email or password'}), 400

            # Получаем пользователя по почте из БД
            user = app.db.find_user_by_email(email)

            # Проверяем, что запрошенный пользователь есть в БД
            if not user:
                return jsonify({'success': False, 'error': 'User not found'}), 404

            # Проверяем, подходит ли пароль
            stored_password = user.password
            if stored_password != password:
                return jsonify({'success': False, 'error': 'Invalid password'}), 401

            return jsonify({'success': True, 'email': email})
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
                data.get('department'),
                data.get('reason')
            )
            return jsonify({'success': True})
        except Exception as e:
            print(f"# Ошибка при добавлении отпуска: {e}")
            return jsonify({'success': False, 'error': 'Ошибка сервера при добавлении отпуска'}), 500
