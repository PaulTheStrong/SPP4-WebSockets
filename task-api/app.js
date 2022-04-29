const express = require('express'),
	// morgan = require('morgan'),
	// path = require('path'),
	mongoSanitize = require('express-mongo-sanitize');
const { checkToken } = require('./service/authService');
	db = require('./ext/db')
  	fileUpload = require('express-fileupload');
	fs = require('fs'),
	cors = require('cors'),
	cookieParser = require('cookie-parser'),
	graphqlService = require('./service/graphqlService');
const app = express();

// app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(mongoSanitize());
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'localhost:3000'],
	credentials: true
}));

app.use(cookieParser());

const permittedUrls = ['/auth/', '/auth/register'];
const permittedPrefixes = ['/tasks/file']

app.use((req, res, next) => {
	let baseUrl =  req.originalUrl;
	if (permittedUrls.includes(baseUrl) || permittedPrefixes.some(value => baseUrl.startsWith(permittedPrefixes))) {
		next();
	} else {
		checkToken(req, res, next);
	}
}) 

app.use('/auth', require('./routes/auth.js'));
// GraphQl
app.use('/graphql', graphqlService);
app.get("/", (req, res) => {
	res.status(200).send();
})
app.use('/tasks/file/:filename', async (req, res) => require('./routes/tasks').getFile(req, res))
app.listen(10005, () => console.log("Express is on 10005"));