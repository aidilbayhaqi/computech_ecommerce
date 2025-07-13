import { Sequelize } from "sequelize";
import db from "../database/database.js";


const { DataTypes } = Sequelize;

const Review = db.define("Review", {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  freezeTableName: true,
  timestamps: true,
});


export default Review;
