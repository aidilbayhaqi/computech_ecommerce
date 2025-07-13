  import Cart from "../models/CartModels.js";
  import CartItem from "../models/CartItem.js";
  import Product from "../models/ProductModels.js";

  export const getCart = async(req, res)=>{
      try {
          const userId =req.user.id

          const cart = await Cart.findOne({
              where:{user_id:userId},
              include:{
                  model:CartItem,
                  include:Product
              }
          })

          if(!cart)return res.status(200).json({message:'empty cart'})

              res.json(cart)
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }

  export const addToCart = async (req, res)=>{
      try {
          const userId = req.user.id;
          const { product_id, quantity = 1 } = req.body;
      
          let cart = await Cart.findOne({ where: { user_id: userId } });
      
          if (!cart) {
            cart = await Cart.create({ user_id: userId });
          }
      
          let item = await CartItem.findOne({
            where: {
              cart_id: cart.id,
              product_id,
            },
          });
      
          if (item) {
            item.quantity += quantity;
            await item.save();
          } else {
            item = await CartItem.create({
              cart_id: cart.id,
              product_id,
              quantity,
              type: req.body.type || null,
            });
          }res.status(201).json({ message: "Product added to cart", item });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

    export const removeFromCart = async (req, res) => {
      try {
        const { itemId } = req.params;

        const item = await CartItem.findByPk(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        await item.destroy();

        res.json({ message: "Item removed from cart" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

    export const decreaseFromCart = async (req, res) => {
      try {
        const userId = req.user.id;
        const { product_id } = req.body;

        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = await CartItem.findOne({
          where: {
            cart_id: cart.id,
            product_id,
          },
        });

        if (!item) return res.status(404).json({ message: "Item not in cart" });

        if (item.quantity > 1) {
          item.quantity -= 1;
          await item.save();
          return res.json({ message: "Quantity decreased", item });
        } else {
          await item.destroy();
          return res.json({ message: "Item removed from cart" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    