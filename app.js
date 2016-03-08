
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
  this.body = response.body.replace('</head>', '<link rel="stylesheet" type="text/css" href="http://this-could-be-mobile.herokuapp.com/styles/' + id + '"/></head>');
})
.get('/styles/:id', function* () {
  var id = this.request.params.id;
  this.body = 'html, body, div, li { color: #f00 !important; }';
});

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 8080);

module.exports = app;
