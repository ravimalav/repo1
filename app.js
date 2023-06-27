const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

const sequelize=require('./util/database')

const Product=require('./models/product')
const User=require('./models/user')
const Cart=require('./models/cart')
const CartItem=require('./models/cart-item')

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>    //important this middleware do not execute by npm start instead of it is call by incoming request ,npm start dont run it
{                           // this middle ware must execute before routes(other middleware)
    User.findByPk(1)
    .then(user=>
        {
            req.user=user;          //it's not a sisple user that is  store in database ,rather than is Sequelize(all the method like destroy are assotiated with it) object
            next();
        })
    .catch(err=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


//asotiation
Product.belongsTo(User,{constraints:true, onDelete:'CASCADE'})  //user created product
User.hasMany(Product)   //user has many product
Cart.belongsTo(User)   //one cart have only one user
User.hasOne(Cart)   //reverse to above one we dont need it
Product.belongsToMany(Cart,{through:CartItem})   //,{through:CartItem} telling taht where this connection is situated
Cart.belongsToMany(Product,{through:CartItem})

sequelize
// .sync({force:true})
.sync()
.then(result=>
    {
    return User.findByPk(1);
    })
.then(user=>
    {
        if(!user)
        {
            return  User.create({id:1,name:'ravi', email:'ravi@ravigmail.com'})
        }
        return user;
    })
.then(user=>
    {
        // console.log(user);
       return user.createCart();    //assosiated(adding) createCart() method with user 
    })
    .then(cart=>
        {
            app.listen(3000);
        })
    .catch(err=>console.log(err))


