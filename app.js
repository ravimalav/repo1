const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");

const app = express();
const MongoConnect = require("./util/database").MongoConnect;
const User = require("./models/user");
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  (
    req,
    res,
    next //important this middleware do not execute by npm start instead of it is call by incoming request ,npm start dont run it
  ) => {
    // this middle ware must execute before routes(other middleware)
    User.findById("6530df1aa8dbf1a5ff5351df")
      .then((user) => {
        if (user) {
          req.user = user; //it's not a simple user that is store in database ,rather than is Sequelize(all the method like destroy are assotiated with it) object
          next();
        } else {
          console.log("user not found");
          next();
        }
      })
      .catch((err) => console.log(err));
  }
);

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);

// //asotiation
// Product.belongsTo(User,{constraints:true, onDelete:'CASCADE'})  //user created product
// User.hasMany(Product)   //user has many product
// Cart.belongsTo(User)   //one cart have only one user
// User.hasOne(Cart)   //reverse to above one we dont need it
// Product.belongsToMany(Cart,{through:CartItem})   //,{through:CartItem} telling taht where this connection is situated
// Cart.belongsToMany(Product,{through:CartItem})

MongoConnect(() => {
  app.listen(3000);
});
