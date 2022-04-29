import './App.css';
import './todo/TodoList';
import TodoList from './todo/TodoList';
import React, { useEffect } from 'react';
import Context from './Context';
import AddTodo from './todo/AddTodo';
import Loader from './todo/Loader';
import Login from './todo/Login'

const server_port = 10005;

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
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var graphql = JSON.stringify({
        query: "{\r\n    tasks {\r\n        code,\r\n        tasks {\r\n            id,\r\n            title,\r\n            dueTo,\r\n            createdAt,\r\n            files,\r\n            isCompleted\r\n        }\r\n    }\r\n}",
        variables: {}
      })
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
        credentials: 'include'
      };

      let response = await fetch(`http://localhost:${server_port}/graphql`, requestOptions); 
      await authenticateResponse(response);  
      response = await response.json();
      response = await response.data;
      response = await response.tasks;
      if (response.code == 200) {
        let tasks = response.tasks.map(todo => {
          if (todo.dueTo != null) {
            todo.dueTo = new Date(todo.dueTo);
          }
          return todo;
        });
        setLoading(false);
        setTodos(tasks);
      } else {
        console.log(response.err);
      } 
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
        fetchTasks();
        setLoading(true);
        setTodos([]);
  }, [])

  async function deleteTask(id) {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var graphql = JSON.stringify({
        query: "mutation($id: String!) {\r\n    deleteTask (id: $id) {\r\n        code, \r\n        err,\r\n        task {\r\n            id, \r\n            title,\r\n            createdAt,\r\n            dueTo,\r\n            files,\r\n            isCompleted\r\n        }\r\n    }\r\n}",
        variables: {"id": id}
      })
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
        credentials: 'include'
      };

      
      let response = await fetch(`http://localhost:${server_port}/graphql`, requestOptions);
      await authenticateResponse(response); 
      response = await response.json();;
      response = await response.data;
      response = await response.deleteTask;
      if (response.code == 200) {
        setTodos(prev => prev.filter(todo => todo.id !== response.task.id));        
      } else {
        console.log(response.err);
      }
    } catch (err) {
      console.log(err);
    }
      
  }

  async function changeDueTo(id, newDate) {
    try {
      let todo = todos.filter(todo => todo.id === id)[0];
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var graphql = JSON.stringify({
        query: "mutation($id: String!, $task: UpdateTask!) {\r\n    updateTask (id: $id, task: $task) {\r\n        code, \r\n        err,\r\n        task {\r\n            id, \r\n            title,\r\n            createdAt,\r\n            dueTo,\r\n            files,\r\n            isCompleted\r\n        }\r\n    }\r\n}",
        variables: {"id": id,"task":{"dueTo": newDate}}
      })
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
        credentials: 'include'
      };

      let response = await fetch(`http://localhost:${server_port}/graphql`, requestOptions);
      await authenticateResponse(response);  
      response = await response.json();;
      response = await response.data;
      response = await response.updateTask;
      if (response.code == 200) {
        let task = response.task;
        setTodos(prev => prev.map(todo => {
          if (todo.id === task.id) {
            return task;
          } 
          return todo;
        }));
      } else {
        console.log(response.err);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function toggleTodo(id) {
    try {
      let todo = todos.filter(todo => todo.id === id)[0];
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var graphql = JSON.stringify({
        query: "mutation($id: String!, $task: UpdateTask!) {\r\n    updateTask (id: $id, task: $task) {\r\n        code, \r\n        err,\r\n        task {\r\n            id, \r\n            title,\r\n            createdAt,\r\n            dueTo,\r\n            files,\r\n            isCompleted\r\n        }\r\n    }\r\n}",
        variables: {"id": id,"task":{"isCompleted": !todo.isCompleted}}
      })
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
        credentials: 'include'
      };

      let response = await fetch(`http://localhost:${server_port}/graphql`, requestOptions);
      await authenticateResponse(response);   
      response = await response.json();;
      response = await response.data;
      response = await response.updateTask;
      if (response.code == 200) {
        let task = response.task;
        setTodos(prev => prev.map(todo => {
          if (todo.id === task.id) {
            return task;
          } 
          return todo;
        }));
      } else {
        console.log(response.err);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function addTodo(message) {    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
      query: "mutation($task: InputTask!) {\r\n    addTask (task: $task) {\r\n        code, \r\n        err,\r\n        task {\r\n            id, \r\n            title,\r\n            createdAt,\r\n            dueTo,\r\n            files,\r\n            isCompleted\r\n        }\r\n    }\r\n}",
      variables: {"task":{"title": message.task.title,"dueTo":message.task.dueTo,"files": message.files}}
    })
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
      credentials: 'include'
    };

    let response = await fetch(`http://localhost:${server_port}/graphql`, requestOptions); 
    await authenticateResponse(response);  
    response = await response.json();;
    response = await response.data;
    response = await response.addTask;
    if (response.code == 201) {
      setTodos(prev => [...prev, response.task])
    } else {
      console.log(response.err);
    }
  }

  return (
    <Context.Provider value={ {deleteTodo: deleteTask, changeDueTo, authenticateResponse} }>
    <div className='wrapper'>
    {authenticated && (
      <div>
        <h1>Your tasks</h1>
        <AddTodo onCreate={addTodo} />
        {(loading) && <Loader />}
        <TodoList todos={todos} onToggle={toggleTodo}
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
