import './App.css';
import './todo/TodoList';
import TodoList from './todo/TodoList';
import React, { useEffect } from 'react';
import Context from './Context';
import AddTodo from './todo/AddTodo';
import Loader from './todo/Loader';
import Login from './todo/Login'

function App() {

  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(true);

  async function authenticateResponse(response) {
    if (response.status == 401) {
      setAuthenticated(false);
      throw new Error('Unauthenticated');
    }
    return response;
  }

  async function fetchTasks() {
    let response = await fetch('http://127.0.0.1:10000/tasks', {
      credentials: "include"
    });
    await authenticateResponse(response);
    response = await response.json();

    let tasks = await response.tasks.map(todo => {
      if (todo.dueTo != null) {
        todo.dueTo = new Date(todo.dueTo)
      }
      return todo;
    });
    setLoading(false);
    setTodos(tasks);
  }

  useEffect(() => {
    (async () => {
      if (authenticated) {
        await fetchTasks();
      }
    })()
  }, [])

  function toggleTodo(id) {
    setLoading(true);
    let todo = todos.filter(todo => todo._id === id)[0];
    fetch("http://127.0.0.1:10000/tasks/" + id,
    {
      method: "PUT",
      credentials: 'include',
      body: `{"isCompleted": ${!todo.isCompleted}}`,
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => authenticateResponse(response))
    .then(response => ({ok: response.ok, statusText: response.statusText}))
    .then(({ok, statusText}) => {
      console.log(statusText);
      if (ok) {
        setTodos(todos.map(todo => {
          if (todo._id === id) {
            todo.isCompleted = !todo.isCompleted;
          }
          return todo;
        })
        );
      } else {
        console.log(statusText);
      }
    }).finally(setLoading(false));
  }

  function deleteTodo(id) {
    fetch("http://127.0.0.1:10000/tasks/" + id,
    {
      method: "DELETE",
      credentials: 'include'
    })
    .then(response => authenticateResponse(response))
    .then(response => ({ok: response.ok, statusText: response.statusText}))
    .then(({ok, statusText}) => {
      if (ok) {
        setTodos(todos.filter(todo => todo._id !== id));        
      } else {
        console.log(statusText);
      }
    });
  }

  function changeDueTo(id, newDate) {
    fetch("http://127.0.0.1:10000/tasks/" + id,
    {
      method: "PUT",
      body: `{"dueTo": "${newDate}"}`,
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include'
    })
    .then(response => authenticateResponse(response))
    .then(response => ({ok: response.ok, message: response.message}))
    .then (({ok, message}) => {
      console.log(message);
      if (ok) {
        setTodos(todos.map(todo => {
          if (todo._id === id) {
            todo.dueTo = newDate;
          }
          return todo;
        }));
      }
    });
  }

  function addTodo(todo) {    
    setTodos(todos.concat([todo]));
  }

  return (
    <Context.Provider value={ {deleteTodo, changeDueTo, authenticateResponse} }>
    <div className='wrapper'>
      {authenticated && (
      <div>
        <h1>Your tasks</h1>
        <AddTodo onCreate={addTodo}/>
        {loading && <Loader />}
        <TodoList todos={todos} 
        onToggle={toggleTodo}
        />
      </div>
      )}
      {!authenticated && (
        <Login loginCallback={() => {setAuthenticated(true); fetchTasks();}}/>
      )}
    </div>
    </Context.Provider>
  );
}

export default App;
