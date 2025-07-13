import { Sequelize } from "sequelize";
import db from "../database/database.js";

const { DataTypes } = Sequelize;

const CartItem = db.define("CartItem", {
  cart_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  type: DataTypes.STRING,
});

export default CartItem;
