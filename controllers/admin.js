const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user, // req.user load all property of user but mongoose only take _id os user
  });
  product
    .save() //in mongoose save method is provided by mingoose we dont need to derive it in model
    .then((result) => {
      console.log("Product added Successfully!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; //query also provided by expressjs
  if (!editMode) {
    res.redirect("/");
  }
  const prodId = req.params.productId; //req and params are provided by express
  // Product.findByPk(prodId)   //old way to find product
  // req.user.getProducts({where:{id:prodId}})  //new way to find product by id
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        // this is for ejs file
        pageTitle: "Edit Product",
        path: "/admin/edit-product", //this url is for navigation
        product: product, // we can use anything inplace of first product
        editing: editMode, //extra parameter used in url
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  //there is three step
  //step 1: we get the id as we know that we are not sending any url so we get it from the hidden input tag
  const prodId = req.body.productId;
  //step 2: fetch the updated data form post request
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

  //  const updatedProduct=new Product(prodId,updatedTitle,updatedPrice,updatedImageUrl,updatedDesc);// new object of Product class
  //step 3: save the updated data into file
  // Product.findById(prodId) //finding the product that gonna update
  Product.findById(prodId) //find the product that gona be updated
    .then((product) => {
      (product.title = updatedTitle),
        (product.price = updatedPrice),
        (product.imageUrl = updatedImageUrl),
        (product.description = updatedDesc);
      return product.save();
    })
    .then(
      (
        result //this then is for promise that is return from above then block
      ) => {
        console.log("product updated successfully!");
        res.redirect("/admin/products");
      }
    )
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then((product) => {
      console.log(product);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .select("title name price") //used to show specific inforamation at front end
    .populate("userId", "name") // used to get required column form db in console orto get specific data
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};
