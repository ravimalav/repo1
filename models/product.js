const db=require('../util/database');

const Cart=require('../models/cart')

module.exports = class Product {
  constructor(id,title, price,imageUrl,description) {
    this.id=id;
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {  
    return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)',
    [this.title,this.price,this.imageUrl,this.description]);
  }

  static delete(id)
  {
    return db.execute(
      'DELETE FROM products WHERE products.id=?',[id]
    );
  }

  static fetchAll() { 
   return db.execute('SELECT * FROM products')   // return all data to controller
  }
  
  static findById(id)
  {
      return db.execute('SELECT * FROM products where products.id=?',[id]);
  }
      
};
