import './App.css';
import './todo/TodoList';
import TodoList from './todo/TodoList';
import React, { useEffect } from 'react';
import Context from './Context';
import AddTodo from './todo/AddTodo';
import Loader from './todo/Loader';
import Login from './todo/Login'

const FETCH_TASKS_TYPE = 'tasks/get';
const DELETE_TASK_TYPE = 'tasks/delete';
const UPDATE_TASK_TYPE = 'tasks/update';
const ADD_TASK_TYPE = 'tasks/add';
const UNAUTHORIZED = 'unauthorized'

function App() {

  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(true);
  const socket = React.useRef();
  const timer = React.useRef();
  const [connected, setConnected] = React.useState(false); 


  async function authenticateResponse(response) {
    if (response.status == 401) {
      setAuthenticated(false);
      throw new Error('Unauthenticated');
    }
    return response;
  }

  function fetchTasks() {
    socket.current.send(JSON.stringify({type: FETCH_TASKS_TYPE}));
  }

  function onTasksFetched(message) {
    if (message.code == 200) {
      let tasks = message.tasks.map(todo => {
        if (todo.dueTo != null) {
          todo.dueTo = new Date(todo.dueTo);
        }
        return todo;
      });
      setLoading(false);
      setTodos(tasks);
    } else {
      console.log(message.err);
    }
  }

  function initSocket(websocket) {
    socket.current = websocket;
    
    websocket.onopen = () => {
      clearInterval(timer.current);
      setConnected(true);
      fetchTasks();
    }

    websocket.onclose = () => {
      setConnected(false);
      setLoading(true);
      setTodos([]);
    }

    websocket.onmessage = (message) => {
      message = JSON.parse(message.data);
      switch (message.type) {
        case FETCH_TASKS_TYPE:
          onTasksFetched(message);
          break;
        case DELETE_TASK_TYPE:
          onDeleteTask(message);
          break;
        case ADD_TASK_TYPE:
          onAddTask(message);
          break;
        case UPDATE_TASK_TYPE:
          onUpdateTask(message);
          break;
        case UNAUTHORIZED:
          setAuthenticated(false);
          break;
      }
    }
  }

  useEffect(() => {    
    initSocket(new WebSocket("ws://localhost:10000")); 
  }, [])

  function deleteTask(id) {
    socket.current.send(JSON.stringify({type: DELETE_TASK_TYPE, taskId: id}));
  }

  function onDeleteTask(message) {
    if (message.code == 200) {
      setTodos(prev => prev.filter(todo => todo._id !== message.task._id));        
    } else {
      console.log(message.err);
    }
  }

  function changeDueTo(id, newDate) {
    socket.current.send(JSON.stringify({
      type: UPDATE_TASK_TYPE, 
      taskId: id, 
      task : {dueTo: newDate}
    }));
  }

  function toggleTodo(id) {
    let todo = todos.filter(todo => todo._id === id)[0];
    socket.current.send(JSON.stringify({
      taskId: id, 
      type: UPDATE_TASK_TYPE, task: {isCompleted: !todo.isCompleted}
    }))
  }

  function onUpdateTask(message) {
    if (message.code === 200) {
      let task = message.task;
      setTodos(prev => prev.map(todo => {
        if (todo._id === task._id) {
          return task;
        } 
        return todo;
      }));
    } else {
      console.log(message.err);
    }
  }

  function onAddTask(message) {
    if (message.code === 201) {
      setTodos(prev => [...prev, message.task])
    } else {
      console.log(message.err);
    }
  }

  function addTodo(message) {    
    socket.current.send(JSON.stringify(message));
  }

  return (
    <Context.Provider value={ {deleteTodo: deleteTask, changeDueTo, authenticateResponse} }>
    <div className='wrapper'>
    {authenticated && (
      <div>
        <h1>Your tasks</h1>
        <AddTodo onCreate={addTodo} />
        {(loading || !connected) && <Loader />}
        <TodoList todos={todos} onToggle={toggleTodo}
        />
      </div>
      )}
      {!authenticated && (
        <Login loginCallback={() => {setAuthenticated(true); fetchTasks(); initSocket(new WebSocket("ws://localhost:10000"))}}/>
      )}
    </div>
    </Context.Provider>
  );
}

export default App;
