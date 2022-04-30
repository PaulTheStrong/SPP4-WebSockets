const {WebSocket, WebSocketServer} = require("ws")
const TaskController = require('./tasks')
const jwt = require('jsonwebtoken')
let cookieParser = require('cookie-parser')

const wss = new WebSocketServer({
    port: 10000
}, () => {
    console.log("Web socket server started on 10000");
})

wss.on('connection', (client, request) => {
    let cookieStr = request.headers.cookie;
    let cookies = cookieStr?.split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {}) ?? [];

    if (cookies["token"] != null) {
        let token = cookies["token"];
        try{
            jwt.verify(token, "secret");
        } catch (err) {
            client.send(JSON.stringify({type: "unauthorized"}));
            client.close();
        }
    } else {
        client.send(JSON.stringify({type: "unauthorized"}));
        client.close();
    }

    client.on('message', (message) => {
        message = JSON.parse(message);
        console.log(message);
        switch (message.type) {
            case 'tasks/get':
                TaskController.getTasks(client, message);
                break;
            case 'tasks/update':
                TaskController.updateTask(client, message);
                break;
            case 'tasks/delete':
                TaskController.deleteTask(client, message);
                break;
            case 'tasks/add':
                TaskController.addTask(client, message);
                break;
            case 'files/get':
                TaskController.getFile(client, message);
                break;
        }
    })
})

module.exports = {wss};