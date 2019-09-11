const path = require('path');
const notFound = require('./controllers/404');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./ulti/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });


app.use('/admin', adminData);
app.use(shopRoutes);

app.use(notFound.notFound);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});


sequelize.sync()//sync({force: true})//
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if(!user){
            return User.create({name: 'hai', email: 'test@test.com'})
        }
        return Promise.resolve(user);
    })
    .then(user => {
        // console.log(user);
        return user.createCart();
        
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });

 

