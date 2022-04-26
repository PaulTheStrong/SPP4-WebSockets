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
async function getFile(socket, message) {
    let filename = message.filename;
    try {
        let data = await fs.readFile("/../taskFiles/" + filename);
        socket.send(data);
    } catch (err) {
        socket.send(JSON.stringify({status: 404, type: message.type}));
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