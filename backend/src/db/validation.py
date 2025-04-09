import re
from datetime import date


# Проверка email (пример: test@example.com)
def is_valid_email(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email))


# Проверка ФИО (только буквы, одинарный дефис, 2-50 символов)
def is_valid_name(name: str) -> bool:
    return bool(re.match(r"^[А-Яа-яA-Za-z]+(-[А-Яа-яA-Za-z]+)?$", name))


# Проверка позиции (любые символы, длина от 0 до 50)
def is_valid_position(position: str) -> bool:
    return 0 < len(position) <= 50


# Проверка пароля (8+ символов, буквы и цифры)
# def is_valid_password(password: str) -> bool:
#     return bool(re.match(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", password))


# Проверка даты отпуска
def is_valid_from_to(fromDate: date, toDate: date) -> bool:
    return isinstance(fromDate, date) and isinstance(toDate, date) and fromDate <= toDate


# Проверка длины причины отпуска (от 1 до 255)
def is_valid_reason(reason: str) -> bool:
    return 1 <= len(reason) <= 255
