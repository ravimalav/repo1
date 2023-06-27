const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const CartItem=sequelize.define('cartItem',
{
  id:
  {
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  quantity:Sequelize.INTEGER   //cart item is combination of cart id ,quantity and which product is in
});

module.exports=CartItem;