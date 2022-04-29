const Task = require('../model/task');
const fs = require('fs');

async function updateTask(id, updateObject) {
    try {
        let task = await Task.findOneAndUpdate({ _id:  id}, updateObject, {returnDocument: 'after'}).exec();
        return { code: 200, task: task };
    } catch (err) {
        return { code: 400, err: "Bad request: " + err};
    }
}

async function getTasks() {
    try {
        let tasks = await Task.find({}).exec();
        return {code: 200, tasks: tasks};
    } catch (err) {
        return {code: 500, err: err};
    }
}

/**
 * 
 * @param {string} id Task's id 
 * @returns {Object} code: result code, task: deleted task
 */
async function deleteTask(id) {
    try {
        let task = await Task.findByIdAndRemove(id).exec();
        return {code: 200, task: task};
    } catch (err) {
        return {code: 404, err};
    }
}

async function addTask(reqTask, files) {
    filelist = [];
    if (files != null && files != undefined) {
        for (let f of files) {
            try {
                fs.writeFile(`taskFiles/${f.name}`, Buffer.from(f.buf), () => {});
                filelist.push(f.name);
            } catch (err) {
                console.log(err);
            }
        }
    }
    let date = reqTask.dueTo;
    let task = new Task({ title: reqTask.title, dueTo: date, files: filelist, isCompleted: false });
    try {
        let result = await task.save();
        return {code: 201, task : result};
    } catch (err) {
        return {code: 400, err: err};
    }
}


module.exports = {getTasks, updateTask, deleteTask, addTask};