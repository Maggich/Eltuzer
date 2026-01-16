#!/usr/bin/env python3
"""
Скрипт для создания первого администратора
Использование: python create_admin.py
"""
import sys
import os

# Добавляем текущую директорию в путь
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_admin():
    db = SessionLocal()
    try:
        username = input("Введите имя пользователя (по умолчанию: admin): ").strip() or "admin"
        email = input("Введите email (по умолчанию: admin@eltuzer.com): ").strip() or "admin@eltuzer.com"
        password = input("Введите пароль (по умолчанию: admin123): ").strip() or "admin123"
        
        # Проверяем, существует ли пользователь
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"❌ Пользователь '{username}' уже существует!")
            return
        
        # Создаем нового пользователя
        hashed_password = get_password_hash(password)
        user = User(
            username=username,
            email=email,
            hashed_password=hashed_password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"✅ Администратор успешно создан!")
        print(f"   Имя пользователя: {username}")
        print(f"   Email: {email}")
        print(f"   Пароль: {password}")
        print(f"\n⚠️  Не забудьте изменить пароль после первого входа!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Ошибка при создании администратора: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()







