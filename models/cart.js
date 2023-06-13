//first of all fetching the cart form file
const { json } = require('body-parser');
const fs=require('fs');

const path=require('path')

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
  );


module.exports=class Cart
{
    static addProduct(id,productPrice)
    {
        // Check there is existing cart or not
        fs.readFile(p,(err,fileContent)=>
        {
            let cart={products:[],totalPrice:0};
            if(!err)
            {
                cart=JSON.parse(fileContent);
            }
            
        //fetching previous cart items

        const existingProductIndex=cart.products.findIndex(prod=> prod.id===id)
        const existingProduct=cart.products[existingProductIndex];
        let updatedProduct;
        //adding new item into cart

        if(existingProduct)
        {
            updatedProduct={...existingProduct};    
            updatedProduct.qty =updatedProduct.qty + 1;
            cart.products=[...cart.products];
            cart.products[existingProductIndex]=updatedProduct;
        }
        else{
            updatedProduct={id: id, qty: 1};
            cart.products=[...cart.products,updatedProduct]
            
        }
        cart.totalPrice +=+productPrice;  //+ sign before productPrice is to convert price into integer from string
        fs.writeFile(p,JSON.stringify(cart),err=>  // save cart back to our file 
        {
            console.log(err);
        })
        })
    }  
    
    
    static getCart(cb)
    {
        fs.readFile(p,(err,fileContent)=>
            {
                const cart=JSON.parse(fileContent);
                if(err)
                {
                    cb(null);
                }
                else{
                    cb(cart);
                } 
            })
    }

    //delete cart items

    static deleteCartProduct(id,productPrice)
    {
       //find the existing item in cart
       fs.readFile(p,(err,fileContent)=>
       {
        if(err)
        {
            return;
        }
        const updatedCart={...JSON.parse(fileContent)};
        const product=updatedCart.products.find(prod=> prod.id===id)
        const productQty=product.qty;
        
        updatedCart.products=updatedCart.products.filter(prod=>prod.id !==id)

        updatedCart.totalPrice=updatedCart.totalPrice-productPrice*productQty;

        
        fs.writeFile(p,JSON.stringify(updatedCart),err=>
        {
            console.log(err);
        })
       })
    }

}