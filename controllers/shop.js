const Product = require("../models/product");

const Cart = require("../models/cart");

const Order = require("../models/order");

const db = require("../util/database");
const { where } = require("sequelize");

exports.getProducts = (req, res, next) => {
  Product.find() //find is inbuilt functio in mongooose
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Products",
        path: "/product",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductId = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({where: {id :prodId}})
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log(user.cart.items);
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "cart",
        pageTitle: "Your cart",
        products: products,
      });
    })
    .catch((err) => console.log("can not access cart"));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });

  // let fecthedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fecthedCart = cart; //now cart is availabel through out the cart
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product; //handle by below hen block
  //     }
  //     // if there is no product into cart than
  //     return Product.findByPk(prodId); //handle by below hen block
  //   })
  //   .then((product) => {
  //     return fecthedCart.addProducts(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log("cannot get cart data"));
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteCartItemById(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log("can not dlete cart item right now"));
};

exports.addOrders = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user }).then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
