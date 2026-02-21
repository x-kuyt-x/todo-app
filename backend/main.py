from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from db import get_connection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Todo(BaseModel):
    id: int | None = None
    title: str
    is_completed: bool = False

@app.get("/todos", response_model=List[Todo])
def get_todos():
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM todos")
    todos = cur.fetchall()
    conn.close()
    return todos

@app.post("/todos")
def create_todo(todo: Todo):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO todos (title, is_completed) VALUES (%s, %s)",
        (todo.title, todo.is_completed)
    )
    conn.commit()
    conn.close()
    return {"message": "created"}

@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: Todo):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE todos SET title=%s, is_completed=%s WHERE id=%s",
        (todo.title, todo.is_completed, todo_id)
    )
    conn.commit()
    conn.close()
    return {"message": "updated"}

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM todos WHERE id=%s", (todo_id,))
    conn.commit()
    conn.close()
    return {"message": "deleted"}