
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const MongooseStore = require('koa-session-mongoose');
const Jade = require('koa-jade');
const logger = require('koa-logger');
const router = require('koa-router')();
const compression = require('koa-compress');
const csrf = require('koa-csrf');
const kstatic = require('koa-static');
const request = require('koa-request');
const mongoose = require('mongoose');
const Style = require('./models/style');
const fulllinks = require('./fulllinks');

console.log('Connecting to MongoDB (required)');
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost');

var app = koa();
const jade = new Jade({
  viewPath: './views'
});
app.use(jade.middleware);

app.use(kstatic(__dirname + '/static'));
app.use(bodyParser());
app.use(compression());
//app.use(cookieParser());

// app.use(logger());
csrf(app);
app.use(csrf.middleware);

app.keys = ['jdoijeijowj28hd9h', 'd89cj92nub9s98sanionwo'];
app.use(session({
  store: new MongooseStore()
}));

// routes
router.get('/', function* () {
  this.render('home', {
    csrfToken: this.csrf,
    sampler: '@media (max-width: 767px) {\n\
  html, body {\n\
    color: red;\n\
  }\n\
}'
  });
})
.get('/page', function* () {
  // console.log(this.request.query);
  var response = yield request(this.request.query.url);
  var id = this.request.query.id;
  this.body = fulllinks(this.request.query.url, this.request.query.id, response.body);
})
.get('/styles/:id', function* () {
  var id = this.params.id;
  this.type =  "text/css";

  if (id === '1') {
    this.body = '@media (max-width: 767px) {\n\
      .header--full-wrap {\n\
        height: auto !important;\n\
      }\n\
      header.wrapper {\n\
        text-align: center;\n\
      }\n\
      header.wrapper > h1 {\n\
        float: none;\n\
        margin-left: auto;\n\
        margin-right: auto;\n\
      }\n\
      .header--full-wrap .wrapper #search, .header--full-wrap .wrapper #search input.s {\n\
        float: none !important;\n\
      }\n\
      .hp-theprinciples #data ol {\n\
        float: none !important;\n\
        width: 90%;\n\
        margin-left: 5%;\n\
      }\n\
      .hp-theprinciples #data ol li {\n\
        padding: 0.5em;\n\
      }\n\
      .home aside, .home .content, .wrapper aside, .wrapper .content {\n\
        width: 90%;\n\
        float: none;\n\
      }\n\
      .footer--full-wrap #join, .footer--full-wrap #footernav {\n\
        float: none;\n\
        width: 90%;\n\
      }\n\
    }';
  } else {
    var s = yield Style.findById(id).exec();
    this.body = s.src;
  }
})
.get('/cssviewer/:id', function* () {
  this.render('css-viewer', {
    id: this.params.id
  });
})
.post('/want', function*() {
  var s = new Style({
    url: this.request.body.url,
    src: this.request.body.css
  });
  s = yield s.save();
  this.redirect('/and/awesome/' + s._id);
})
.get('/and/awesome/:id', rendered)
.get('/but/you/playin/:id', rendered)
.get('/but/you/playing/:id', rendered)
.get('/mobile', mobile)
.get('/mobilefix', mobilefix);

function* rendered() {
  var url = 'http://thiscouldbemobile.com/sample.htm';
  var id = this.params.id;
  if (id !== '1') {
    var s = yield Style.findById(id).exec();
    url = s.url;
  }
  this.render('care-package', {
    id: id,
    url: url
  });
}

function* mobile() {
  var url = this.request.query.url;
  var id = this.request.query.id;
  this.render('mobile', {
    id: id,
    url: url,
    fix: false
  });
}

function* mobilefix() {
  var url = this.request.query.url;
  var id = this.request.query.id;
  this.render('mobile', {
    id: id,
    url: url,
    fix: true
  });
}

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 8080);

module.exports = app;
