import { Sequelize } from "sequelize";
import db from "../database/database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING(50),
    },
    password: DataTypes.STRING,

    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    no_hp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default User;
