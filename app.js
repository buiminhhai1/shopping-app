const path = require('path');

const notFound = require('./controllers/404');
const express = require('express');
const bodyParser = require('body-parser');

const mongoConnect = require('./ulti/database').mongoConnect;
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5d87209e1c9d440000528f06')
      .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
      })
      .catch(err => console.log(err));
  });


app.use('/admin', adminData);
app.use(shopRoutes);

app.use(notFound.notFound);

mongoConnect(() => {   

    app.listen(3000);
});