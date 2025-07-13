import { Sequelize } from "sequelize";
import db from "../database/database.js";

const { DataTypes } = Sequelize;

const Order = db.define(
  "Order",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_payment: {
      type: DataTypes.ENUM(
        "pending",
        "complete",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Order;
