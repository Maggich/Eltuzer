FROM python:3.11-slim

WORKDIR /app

# Обновляем pip и устанавливаем зависимости с увеличенными таймаутами
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --default-timeout=100 --retries=5 -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

