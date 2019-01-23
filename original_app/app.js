var createError = require('http-errors');
var express = require('express');
var path = require('path');
var hbs = require('hbs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');


var indexRouter = require('./routes/index');
var user = require('./routes/user');
var viewer = require('./routes/viewer');
var auth = require('./routes/auth');
var categories = require('./routes/categories');
var randomvideos = require('./routes/randomvideos');
var search_videos = require('./routes/search_videos');



var app = express();


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
    extname:'hbs',
    layoutsDir:__dirname+'/views/partials/',
    defaultLayout:'layout'
  }));
  
app.set('view engine', 'hbs');

// Handlebars helpers
hbs.registerHelper('if_eq', function(a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

hbs.registerHelper('formatMe', function(txt) {

  txt = path.basename(txt,'.mp4');
  txt =  decodeURI(txt) ;
  return txt.substring(0, 20);

});

hbs.registerHelper('Get_Name', function(txt) {
  var url = txt.split('/upload/');
  var name = url[1];
  return name;

});

// setting handlebars partials
hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'videos')));
app.use(express.static(path.join(__dirname, 'profile_pics')));
app.use(express.static(path.join(__dirname, 'thumbnails')));


app.use('/', indexRouter);
app.use('/categories',categories);
app.use('/user',user);
app.use('/viewer',viewer);
app.use('/auth',auth);
app.use('/randomvideos', randomvideos);
app.use('/search_videos', search_videos);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




// Handlebars helpers
hbs.registerHelper('if_eqs', function(a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
