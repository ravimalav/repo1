const Product = require('../models/product');

const Cart=require('../models/cart');

const db=require('../util/database');
const { where } = require('sequelize');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products=>
    {
      res.render('shop/index',
      { 
        prods: products,
        pageTitle:'Products',
        path:'/product'
      });
    })
  .catch(err=>console.log(err))
};

exports.getProductId=(req,res,next)=>
{
  const prodId=req.params.productId;
  // Product.findAll({where: {id :prodId}})
  Product.findByPk(prodId)
  .then(product=>{
    res.render('shop/product-detail',{
      product: product,
      pageTitle: product.title,
      path:'/products'})
  })
  .catch(err=>console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products=>
  {
    res.render('shop/index',
    {
      prods:products,
      pageTitle:'Shop',
      path:'/'
    })
  })
  .catch(err=>console.log(err))
};

exports.getCart = (req, res, next) => {
  req.user
         .getCart()
         .then(cart=>
         {
            return cart.getProducts().then(products=> 
                res.render('shop/cart',
                  {
                    path:'cart',
                    pageTitle:'Your cart',
                    products:products
                  })
              ).catch(err=>console.log("something not good with cart"))
         })
         .catch(err=>console.log("can not access cart"))
};

exports.postCart=(req,res,next)=>
{
  const prodId=req.body.productId;
  let fecthedCart;
  let newQuantity=1;  
  req.user
  .getCart()
  .then(cart=>
    {
      fecthedCart=cart;     //now cart is availabel through out the cart
      return cart.getProducts({where:{id:prodId}})
    })
  .then(products=>
    {
      let product;
      if(products.length>0)
      {
        product=products[0];
      }
      if(product)
      {
          const oldQuantity=product.cartItem.quantity;
          newQuantity=oldQuantity+1;
          return product;    //handle by below hen block
      }
      // if there is no product into cart than
      return Product.findByPk(prodId)   //handle by below hen block
    })
        .then(product=>
            {
              return fecthedCart.addProducts(product,{
                through:{quantity:newQuantity}
              })
            })
       .then(()=>
        {
          res.redirect('/cart'); 
        })
  .catch(err=>console.log('cannot get cart data'))
}

exports.postDeleteCart=(req,res,next)=>
{
  const prodId=req.body.productId;
  req.user
  .getCart()
  .then(cart=>
    {
     return cart.getProducts({where:{id:prodId}})   
    })
  .then(products=>
    {
      const product=products[0];       //gets response in the form of json where data is first element of json responce
      return product.cartItem.destroy();
    })
    .then(()=>
    {
      res.redirect('/cart');
    })
  .catch(err=>console.log("can not dlete cart item right now"))
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
