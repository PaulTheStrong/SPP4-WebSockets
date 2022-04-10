const db = require('../ext/db');

const schema = db.Schema({
    title: {
        type: String, 
        required: true, 
        maxlength: 255, 
        minlength: 2,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    files: {
        type: Array,
    },
    dueTo: {
        type: Date,
        reqired: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    finishedAt: {
        type: Date
    }
});

module.exports = db.model("Task", schema);