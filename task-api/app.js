const express = require('express'),
	morgan = require('morgan'),
	path = require('path'),
	mongoSanitize = require('express-mongo-sanitize');
  	fileUpload = require('express-fileupload');
	fs = require('fs'),
	cors = require('cors'),
	cookieParser = require('cookie-parser');
const app = express(),
	port = 10000

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(fileUpload());
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
	credentials: true
}));
app.use(cookieParser());

fs.readdirSync('./routes').forEach(file => {
	let fileName = file.slice(0, -3);
	console.log(`Scanning ${fileName}`);
	app.use('/' + fileName, require('./routes/' + fileName))
});

app.listen(port, () => {
	console.log('server started on http://localhost:' + port)
})