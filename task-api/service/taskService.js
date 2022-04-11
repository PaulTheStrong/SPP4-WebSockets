const Task = require('../model/task')

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
    console.log(files);
    if (files != null) {
        for (let f in files) {
            filelist.push(files[f].name);
            files[f].mv("taskFiles/" + files[f].name);
        }
    }
    let date = reqTask.dueTo == 'null' ? null : new Date(reqTask.dueTo.substring(1, reqTask.dueTo.length - 1));
    let task = new Task({ title: reqTask.title, dueTo: date, files: filelist });
    try {
        let result = await task.save().exec();
        return {code: 201, task : result};
    } catch (err) {
        return {code: 400, err: err};
    }
}


module.exports = {getTasks, updateTask, deleteTask, addTask};