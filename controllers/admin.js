const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
  });
};

exports.postAddProduct = (req, res, next) => {
  const id=null;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(id,title, imageUrl,price,description);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode=req.query.edit;   //query also provided by expressjs
  if(!editMode)
  {
    res.redirect('/');
  }
  const prodId=req.params.productId;   //req and params are provided by express
  Product.findById(prodId,product=>
    {
      if(!product)
      {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {  // this is for ejs file 
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',  //this url is for navigation  
        product:product,              // we can use anything inplace of first product
        editing:editMode              //extra parameter used in url  
    });
  });
};

exports.postEditProduct=(req,res,next)=>
{
   //there is three step 
   //step 1: we get the id as we know that we are not sending any url so we get it from the hidden input tag
     const prodId=req.body.productId;
   //step 2: fetch the updated data form post request
     const updatedTitle=req.body.title;
     const updatedImageUrl=req.body.imageUrl;
     const updatedPrice=req.body.price;
     const updatedDesc=req.body.description;
     
     const updatedProduct=new Product(prodId,updatedTitle,updatedImageUrl,updatedPrice,updatedDesc);// new object of Product class
     //step 3: save the updated data into file
     updatedProduct.save();

     res.redirect('/admin/products');
}

exports.postDeleteProduct=(req,res,next)=>
{
  const prodId=req.body.productId;
  Product.delete(prodId);
  res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
