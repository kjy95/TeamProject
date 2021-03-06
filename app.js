var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var passport = require('passport');
//var passportConfig = require('./lib/passport-config');

var mysql = require('mysql'); 
var conn = mysql.createConnection({
  host     : '58.123.136.107',
  port     : '3308',
  user     : 'web',
  password : 'mju12345',
 // database : 'arduino'
});
conn.connect();

/*-----------------url require-----------------*/ 
var index = require('./routes/index');
var users = require('./routes/users');
/*-----------------url require-----------------*/ 
var app = express();

// view를 뭘로 쓸지 결정 - pug, html 등
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.moment = require('moment');
app.locals.querystring = require('querystring');

//db connect
/*
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});*/


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

// session을 사용할 수 있도록.
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));
app.use(flash()); // flash message를 사용할 수 있도록
app.use(express.static(path.join(__dirname, 'public')));



/*-----------------url route-----------------*/
app.use('/', index);
app.use('/users', users);
/*-----------------url route-----------------*/



// 에러처리
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');//에러페이지 설정
});

module.exports = app;
