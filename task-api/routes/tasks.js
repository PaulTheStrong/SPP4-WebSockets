const TaskService = require('../service/taskService');

const fs = require('fs');

/**
 * 
 * @param {WebSocket} socket 
 */
async function getTasks(socket, message) {
    let result = await TaskService.getTasks();
    socket.send(JSON.stringify({type: message.type, ...result}));
} 

/**
 * 
 * @param {WebSocket} socket 
 * @param {Object} message 
 */
async function updateTask(socket, message) {
    let id = message.taskId;
    let updateObject = message.task;
    let result = await TaskService.updateTask(id, updateObject);
    socket.send(JSON.stringify({...result, type: message.type}));
};

/**
 * 
 * @param {WebSocket} socket 
 * @param {Object} message 
 */
 async function getFile(req, res) {
    let filename = req.params.filename;
    try {
        fs.readFile("./taskFiles/" + filename, (err, data) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    } catch (err) {
        print(err);
    }
}

/**
 * 
 * @param {WebSocket} socket 
 * @param {Object} message 
 */
async function addTask(socket, message) {
    let files = message.files;
    let task  = message.task;
    let result = await TaskService.addTask(task, files);
    socket.send(JSON.stringify({...result, type: message.type})); 
}

/**
 * 
 * @param {WebSocket} socket 
 * @param {Object} message 
 */
async function deleteTask(socket, message) {
    let id = message.taskId;
    let result = await TaskService.deleteTask(id);
    socket.send(JSON.stringify({...result, type: message.type}));
}

module.exports = {getTasks, updateTask, getFile, addTask, deleteTask}; 