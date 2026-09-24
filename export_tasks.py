import psycopg2
import csv
from datetime import datetime

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="taskmanager",
    user="postgres",
    password="KseshaTyu"
)

cursor = conn.cursor()
cursor.execute("SELECT id, title, description, status, created_at FROM tasks ORDER BY id")
tasks = cursor.fetchall()

filename = f"tasks_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

with open(filename, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['ID', 'Название', 'Описание', 'Статус', 'Дата создания'])
    writer.writerows(tasks)

print(f"Экспортировано {len(tasks)} задач в файл {filename}")

cursor.close()
conn.close()