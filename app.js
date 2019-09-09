const path = require('path');
const notFound = require('./controllers/404');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./ulti/database');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData);
app.use(shopRoutes);

app.use(notFound.notFound);

sequelize.sync()
    .then(result => {
        //console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });

 

