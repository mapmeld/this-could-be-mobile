
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const Jade = require('koa-jade');
const logger = require('koa-logger');
const router = require('koa-router')();
const compression = require('koa-compress');
const csrf = require('koa-csrf');
const kstatic = require('koa-static');

const mongoose = require('mongoose');
const thunkify = require('thunkify');
const request = require('koa-request');

console.log('Connecting to MongoDB (required)');
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost');
mongoose.connection.on("error", function(err) {
  console.log(err);
});

var app = koa();
const jade = new Jade({
  viewPath: './views'
});
app.use(jade.middleware);

app.use(kstatic(__dirname + '/static'));
app.use(bodyParser());
app.use(compression());
//app.use(cookieParser());

app.keys = ['wkpow3jocijoid3jioj3', 'cekopjpdjjo3jcjio3jc'];
app.use(session({
  store: new MongoStore()
}));

// app.use(logger());
csrf(app);
app.use(csrf.middleware);

// routes
router.get('/', function* () {
  this.render('home');
})
.get('/page', function* () {
  // console.log(this.request.query);
  var response = yield request(this.request.query.url);
  var id = this.request.query.id;
  this.body = response.body.replace('</head>', '<link rel="stylesheet" type="text/css" href="/styles/' + id + '"/></head>');
})
.get('/styles/:id', function* () {
  var id = this.params.id;
  this.type =  "text/css";
  this.body = '@media (max-width: 767px) { \
  .header--full-wrap { \
    height: auto !important; \
  } \
  header.wrapper { \
    text-align: center; \
  } \
  header.wrapper > h1 { \
    float: none; \
    margin-left: auto; \
    margin-right: auto; \
  } \
  .header--full-wrap .wrapper #search, .header--full-wrap .wrapper #search input.s { \
    float: none !important; \
  } \
  .hp-theprinciples #data ol { \
    float: none !important; \
    width: 90%; \
    margin-left: 5%; \
  } \
  .hp-theprinciples #data ol li { \
    padding: 0.5em; \
  } \
  .home aside, .home .content, .wrapper aside, .wrapper .content { \
    width: 90%; \
    float: none; \
  } \
  .footer--full-wrap #join, .footer--full-wrap #footernav { \
    float: none; \
    width: 90%; \
  } \
}';
});

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 8080);

module.exports = app;
