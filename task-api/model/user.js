const db = require('../ext/db');

const schema = db.Schema({
    username: {
        type: String,
        minlength: 4,
        maxlength: 20,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = db.model("User", schema);