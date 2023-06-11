const fs = require('fs');
const path = require('path');
const Cart=require('../models/cart');
const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id,title, imageUrl,price,description) {
    this.id=id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {  
    getProductsFromFile(products => {
    if(this.id)   //if products already have id(means product taht will be updated)
    {
      const existingProductIndex=products.findIndex(prod=> prod.id===this.id);
      const updatedProducts=[...products];
      updatedProducts[existingProductIndex]=this;     //this referring to current(data that will be updated)
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {    //saving updated data into file
        console.log(err);
      });
    }
    else{
      this.id=Math.random().toString(); //generating id for new products
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
   
    }
  });
  }

 
  static delete(id)
  {
    getProductsFromFile(products=>
      {
        const product=products.find(prod=> prod.id===id);
        const reaminingProduct=products.filter(prod=> prod.id!==id);   // filter function return array that dont have deleted item
  
        fs.writeFile(p, JSON.stringify(reaminingProduct), err => {    //saving updated data into file
          if(!err)
          {
            Cart.deleteCartProduct(id,product.price);
          }
        });
      })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  
  static findById(id,cb)
  {
      getProductsFromFile(products=>
        {
          const product=products.find(p=> p.id===id)
          cb(product)
        })
  }
};
