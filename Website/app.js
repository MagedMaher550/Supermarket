const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const session=require('express-session');
const mongodbStore=require('connect-mongodb-session')(session);
const port = 3050;
var path = require('path');
const shopRoutes = require('./Routers/shopRoutes');
const adminRoutes = require('./Routers/adminRoutes');
const authRoutes = require('./Routers/authRoutes');
const { getCategories } = require('./controller/shop');


const Store=new mongodbStore({
    uri:"mongodb+srv://node-example-1-user:node-example-1-user@node-example-1.b86q3.mongodb.net/project?retryWrites=true&w=majority",
    collection:'sessions'
});

app.set('view engine','ejs');
app.set('views','views');

//const adminRoutes=require('./Routers/adminRoutes');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:"my secret",
    resave:true,
    saveUninitialized:true,
    store:Store
}));

app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.text({ type: 'text/xml' }))
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        console.log(req.session.user._id);
        next();
      })
      .catch(err => console.log(err));
  });

//app.use('/admin',adminRoutes);
app.use('/shop',shopRoutes);
app.use('/admin',adminRoutes);
app.use('/auth',authRoutes);

app.listen(port);


