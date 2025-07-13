import db from "../database/database.js";
import { Sequelize } from "sequelize";

const {DataTypes} = Sequelize

const Cart = db.define('Cart', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});


export default Cart
