import { Sequelize } from "sequelize";
import db from '../database/database.js'

const {DataTypes}=Sequelize

const Shipping = db.define(
  "Shipping",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shipping_status: {
      type: DataTypes.ENUM("preparing", "shipped", "delivered"),
      defaultValue: "preparing",
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_cost: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shipped_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
 
        export default Shipping