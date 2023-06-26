const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({     //createProduct method is provide by sequelize when we build assosition bw User and Product method provided by sequelize
    title:title,               // createProduct method is the modern way to stablize relation bw user nad product
    imageUrl:imageUrl,
    price:price,
    description:description
  })
  // Product.create(
  //   {              //create method provided by sequelize
  //     title:title,
  //     imageUrl:imageUrl,
  //     price:price,
  //     description:description,
  //     userId:req.user.id
  //   }
  // )
  .then(result=>
    {
     console.log("Created Successfully!")
     res.redirect('/admin/products')
    }
    )
  .catch(err=>console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode=req.query.edit;   //query also provided by expressjs
  if(!editMode)
  {
    res.redirect('/');
  }
  const prodId=req.params.productId;   //req and params are provided by express
  // Product.findByPk(prodId)   //old way to find product
  req.user.getProducts({where:{id:prodId}})  //new way to find product by id
  .then(products=>
  {
    const product=products[0];
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
  })
  .catch(err=>console.log(err))
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
     
    //  const updatedProduct=new Product(prodId,updatedTitle,updatedPrice,updatedImageUrl,updatedDesc);// new object of Product class
     //step 3: save the updated data into file
     Product.findByPk(prodId)    //finding the product that gonna update
     .then(product=>
      {
        product.title=updatedTitle,
        product.price=updatedPrice,
        product.imageUrl=updatedImageUrl,
        product.description=updatedDesc
        return product.save();   //save() method is provided by sequelize
      })
      .then(result=>     //this then is for promise that is return from above then block  
        {
           console.log('product updated successfully!')
           res.redirect('/admin/products')
        })
      .catch(err=>console.log(err)); 
    
}

exports.postDeleteProduct=(req,res,next)=>
{
  const prodId=req.body.productId;
  Product.destroy({where:{id:prodId}})
  .then(()=>
  {
    res.redirect('/admin/products');
  })  
  .catch(err=>console.log(err)) 
}

exports.getProducts = (req, res, next) => {
  // Product.findAll()  //old way to find All product
  req.user.getProducts()
  .then(products=>
  {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>console.log(err))
};
