from flask import jsonify


def register_routes(app):
    @app.route('/api/users', methods=['GET'])
    def get_users():
        # Берём таблицу
        users_table = app.db.users_table

        # Читаем данные
        with app.db.engine.connect() as conn:
            result = conn.execute(users_table.select()).fetchall()

        # Преобразуем в JSON-совместимый формат
        users = [
            {column: str(value) for column, value in zip(users_table.columns.keys(), row)}
            for row in result
        ]
        return jsonify(users)