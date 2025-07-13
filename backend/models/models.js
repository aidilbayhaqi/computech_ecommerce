import db from "../database/database.js";
import Sequelize from "sequelize";

// Import semua model
import User from "./UserModels.js";
import Product from "./ProductModels.js";
import Cart from "./CartModels.js";
import CartItem from "./CartItem.js";
import Order from "./OrderModels.js";
import OrderItem from "./OrderItem.js";
import Payment from "./paymentModels.js";
import Shipping from "./ShippingModels.js";
import Review from "./ReviewModels.js";

// order product
// Relasi antara OrderItem dan Order: Banyak OrderItem milik satu Order (Many-to-One)
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
// Relasi antara OrderItem dan Product: Banyak OrderItem milik satu Product (Many-to-One)  
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
// Relasi antara Order dan OrderItem: Satu Order punya banyak OrderItem (One-to-Many)
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
// Relasi antara Product dan OrderItem: Satu Product bisa muncul di banyak OrderItem (One-to-Many)
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
// Relasi antara Order dan User: Satu Order dimiliki oleh satu User (Many-to-One)
Order.belongsTo(User, { foreignKey: "user_id" });
// Relasi antara User dan Order: Satu User bisa memiliki banyak Order (One-to-Many)
User.hasMany(Order, { foreignKey: 'user_id' });

// payment product
// relasi antara payment dengan order (1 to 1)
Payment.belongsTo(Order, { foreignKey: "order_id" });
// relasi antara order dengan payment (1 to 1)
Order.hasOne(Payment, { foreignKey: 'order_id' });

// cart product
// relasi antara cart dengan user (1 to 1)
Cart.belongsTo(User, { foreignKey: 'user_id' });
// relasi antara user dan cart (1 to 1)
User.hasOne(Cart, { foreignKey: 'user_id' });
// relasi antara cart item dengan card (1 to 1)
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
// relasi antara cart item dengan product (1 to many)
CartItem.belongsTo(Product, { foreignKey: 'product_id' });
// relasi antara cart dengan cart item (many to 1)
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
// relasi antara product dengan cart item (many to 1)
Product.hasMany(CartItem, { foreignKey: 'product_id' });

// product user
// relasi antara user dan product (1 to many)
User.hasMany(Product, { foreignKey: "user_id" });
Product.belongsTo(User, { foreignKey: "user_id" });


// relasi antara shipping dengan order (1 to many)
Order.hasOne(Shipping, { foreignKey: "order_id" });
Shipping.belongsTo(Order, { foreignKey: "order_id" });

// review user
// relasi antara review dengan product (1 to many)
Review.belongsTo(Product, { foreignKey: "product_id" });
// relasi antara review dengan user (many to 1)
Review.belongsTo(User, { foreignKey: "user_id" });


export {
  db,
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Shipping,
  Review,
  Payment
};
