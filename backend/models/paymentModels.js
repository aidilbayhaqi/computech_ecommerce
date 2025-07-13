import { Sequelize } from "sequelize";
import db from "../database/database.js";

const {DataTypes}= Sequelize

const Payment = db.define("Payment", {
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  transaction_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  payment_gateway_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "ID dari Midtrans atau gateway lain",
  },
  gross_amount: {
    type: DataTypes.INTEGER, // max 999 Triliun, 2 angka di belakang koma
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.ENUM("paid", "complete",'pending', 'failed'),
  },
});


export default Payment