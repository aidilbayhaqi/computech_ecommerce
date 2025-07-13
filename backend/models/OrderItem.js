import { Sequelize } from "sequelize";
import db from "../database/database.js";

const { DataTypes } = Sequelize;

const   OrderItem = db.define(
  "OrderItem",
  {
    order_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default OrderItem;
