const express = require('express'),
	// morgan = require('morgan'),
	// path = require('path'),
	// mongoSanitize = require('express-mongo-sanitize');
  	fileUpload = require('express-fileupload');
	fs = require('fs'),
	cors = require('cors'),
	cookieParser = require('cookie-parser');
const app = express();

// app.use(morgan('combined'))
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(mongoSanitize());
// // app.use(cors({
// //     origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
// // 	credentials: true
// // }));

// // app.use(cookieParser());

app.use('/auth', require('./routes/auth.js'));
app.listen(10001, () => console.log("Express is on 10001"));