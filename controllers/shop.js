const Product = require('../models/product');

const Cart=require('../models/cart');

const db=require('../util/database')

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows,fieldData])=>
  {
    res.render('shop/index',
    { 
      prods: rows,
      pageTitle:'Products',
      path:'/product'
    });
  })
  .catch(err=>console.log(err))
};

exports.getProductId=(req,res,next)=>
{
  const prodId=req.params.productId;
  Product.findById(prodId).then(([product])=>{
    res.render('shop/product-detail',{
      product: product[0],
      pageTitle: product.title,
      path:'/products'})
  })
  .catch(err=>console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(([rows,fieldData])=>
  {
    res.render('shop/index',
    {
      prods:rows,
      pageTitle:'Shop',
      path:'/'
    })
  })
};

exports.getCart = (req, res, next) => {
  
  Cart.getCart(cart=>
    {
     Product.fetchAll(products=>     //find data that also present in cart as well as product
      {
         const cartProducts=[]; //empty array to store data that are also present into cart
        for(product of products)
        {
          const cartProductData=cart.products.find(prod=> prod.id===product.id)
        if(cartProductData)
        {
           cartProducts.push({productData:product,qty:cartProductData.qty})
        }
        }
        res.render('shop/cart',
        {
          path:'cart',
          pageTitle:'Your cart',
          products:cartProducts
        })
        
      }
      )

    })
  
};

exports.postCart=(req,res,next)=>
{
  const prodId=req.body.productId;
  Product.findById(prodId,(product)=>
  {
    Cart.addProduct(prodId,product.price)
  })
  res.redirect('/cart');
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
