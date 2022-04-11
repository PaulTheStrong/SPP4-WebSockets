const {WebSocket, WebSocketServer} = require("ws")
const TaskController = require('./tasks')

const wss = new WebSocketServer({
    port: 10000
}, () => {
    console.log("Web socket server started");
})

wss.on('connection', (client) => {
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

const messageIn = {
    type: String,
    messge: Object,
    token: String
}

const messageOut = {

}