//first of all fetching the cart form file
const fs=require('fs');

const path=require('path')

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
  );


module.exports=class cart
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
}