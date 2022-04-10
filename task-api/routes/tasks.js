const { response } = require('express');
const {getTasks, updateTask, deleteTask, addTask} = require('../service/taskService');

const router = require('express').Router(),
    Task = require('../model/task'),
    fs = require('fs'),
    path = require('path'),
    jwt = require('jsonwebtoken');

function authProxy(req, res, next) {
    console.log("Cookies: " + JSON.stringify(req.cookies, null, ' '));
    jwt.verify(req.cookies["token"], "secret", (err, decoded) => {
        if (err) {
           res.status(401).send("Error: " + err);
           return; 
        }
        next();
    })
}

router.get("/", authProxy, async (req, res) => {
    let result = await getTasks();
    if (result.err) {
        res.status(500).send();
    } else {
        res.status(200).send({tasks: result.tasks})
    }
});

router.put("/:id", authProxy, async (req, res) => {
    let id = req.params.id
    let updateObject = {};
    Object.keys(req.body).forEach(key => updateObject[key] = req.body[key]);
    let result = await updateTask(id, updateObject);
    res.status(result.code).send(result.msg);
});

router.get("/file/:filename", authProxy, (req, res) => {
    res.sendFile("/" + req.params.filename, {root: path.join(__dirname + "/../taskFiles")});
})

router.post("/", authProxy, async (req, res) => {
    let files = req.files;
    let task  = req.body;
    let result = await addTask(task, files);
    res.status(result.code).send({task: result.task, err: result.err});
});

router.delete("/:id", authProxy, async (req, res) => {
    let id = req.params.id;
    let result = await deleteTask(id);
    res.status(result.code).send();
});

module.exports = router;