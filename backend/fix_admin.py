#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import User
import bcrypt

def get_password_hash(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def fix_admin():
    db = SessionLocal()
    try:
        username = "admin"
        password = "admin123"
        
        # Удаляем старого пользователя если есть
        old_user = db.query(User).filter(User.username == username).first()
        if old_user:
            db.delete(old_user)
            db.commit()
            print("Старый пользователь удален")
        
        # Создаем нового с правильным хешем
        hashed_password = get_password_hash(password)
        user = User(
            username=username,
            email="admin@eltuzer.com",
            hashed_password=hashed_password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"✅ Администратор создан!")
        print(f"   Логин: {username}")
        print(f"   Пароль: {password}")
        print(f"   Хеш: {hashed_password[:50]}...")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    fix_admin()

