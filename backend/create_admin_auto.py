#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_admin():
    db = SessionLocal()
    try:
        username = "admin"
        email = "admin@eltuzer.com"
        password = "admin123"
        
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"✅ Пользователь '{username}' уже существует!")
            print(f"   Логин: {username}")
            print(f"   Пароль: {password}")
            return
        
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
        print(f"   Логин: {username}")
        print(f"   Пароль: {password}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Ошибка: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()

