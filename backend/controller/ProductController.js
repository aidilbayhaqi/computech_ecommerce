import Product from "../models/ProductModels.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Cart from "../models/CartModels.js";
import CartItem from "../models/CartItem.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    const updatedProducts = products.map((product) => ({
      ...product.toJSON(),
      image: product.image
        ? product.image
            .split(", ")
            .map((img) => `http://localhost:5000/uploads/${img}`)
        : [],
    }));

    res.json({ products: updatedProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findByPk(id);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, desc, stock, categories, price } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - user not found" });
  }

  let types = [];
  if (req.body.type) {
    try {
      types = Array.isArray(req.body.type)
        ? req.body.type
        : JSON.parse(req.body.type);

      if (!Array.isArray(types) || !types.every((t) => t.name && t.price)) {
        return res.status(400).json({
          message: "Tipe harus array berisi objek dengan 'name' dan 'price'",
        });
      }
    } catch (err) {
      return res.status(400).json({
        message: "Format type tidak valid. Harus array objek atau JSON string.",
      });
    }
  }

  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const image = req.files ? req.files.map((file) => file.filename) : [];

    const newProduct = await Product.create({
      name,
      desc,
      type: JSON.stringify(types),
      stock: parseInt(stock),
      price: parseInt(price),
      categories,
      user_id: req.user.id,
      image: image.join(", "),
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("ERROR CREATE PRODUCT:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, desc, price, stock, categories, type } = req.body;
  const image = req.files ? req.files.map((file) => file.filename) : [];

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({
      name,
      desc,
      type,
      price,
      stock,
      categories,
      image: image.length ? image.join(", ") : product.image, // Jika ada gambar baru, simpan yang baru, jika tidak, tetap gunakan yang lama
    });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await CartItem.destroy({ where: { product_id: id } });

    // Hapus gambar produk jika ada di folder uploads
    if (product.image) {
      const imageArray = product.image
        .split(", ")
        .filter((img) => img.trim() !== "");
      imageArray.forEach((img) => {
        const imagePath = path.join(__dirname, "..", "public", "uploads", img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
