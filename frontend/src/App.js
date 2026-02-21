import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:8000/todos");
    setTodos(await res.json());
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    await fetch("http://localhost:8000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    setTitle("");
    fetchTodos();
  };

  const toggleTodo = async (todo) => {
    await fetch(`http://localhost:8000/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todo.title,
        is_completed: !todo.is_completed
      })
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:8000/todos/${id}`, {
      method: "DELETE"
    });
    fetchTodos();
  };

return (
  <div className="app">
    <header className="header">
      <h1>📝 Task Manager</h1>
      <p>あなたの毎日を整理しよう</p>
    </header>

    <div className="card">
      <div className="input-group">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="やることを入力してください"
        />
        <button onClick={addTodo}>追加</button>
      </div>

      <ul className="task-list">
        {todos.map(todo => (
          <li key={todo.id} className="task-item">
            <div className="task-content">
              <span
                onClick={() => toggleTodo(todo)}
                className={todo.is_completed ? "completed" : ""}
              >
                {todo.title}
              </span>

              <span
                className={
                  todo.is_completed
                    ? "status completed-badge"
                    : "status active-badge"
                }
              >
                {todo.is_completed ? "完了" : "進行中"}
              </span>
            </div>

            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-btn"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);}

export default App;