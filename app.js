const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");

const app = express();
// const MongoConnect = require("./util/database").MongoConnect;
// const User = require("./models/user");
// const Product = require("./models/product");
const User = require("./models/user");
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
    User.findById("6533d69f7f82cbc1c8d2ecb6")
      .then((user) => {
        if (user) {
          // req.user = new User(user.name, user.email, user.cart, user._id); //it's not a simple user that is store in database ,rather than is MongoDB(all the method like destroy are assotiated with it) object
          req.user = user;
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

mongoose
  .connect(
    "mongodb+srv://ravimalav0022:Ravimalav123@cluster0.tvvqc3u.mongodb.net/ecommerceappdata?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "ram",
          email: "ram@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.log(err));
