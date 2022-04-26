const db = require('mongoose')
db.connect("mongodb://localhost:27017/tasks", {

})   
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));

module.exports = db