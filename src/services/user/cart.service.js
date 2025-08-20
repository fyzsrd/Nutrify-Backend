import Cart from "../../models/user/cart.model.js";
import CartItem from "../../models/user/carItem.model.js";
import Variant from '../../models/admin/Variant.js'

export const getUserCartWithItems = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId });
    return { cart, items: [] }; // empty cart
  }

  const items = await CartItem.find({ cartId: cart._id })
   .select("-__v -createdAt -updatedAt -cartId")
    .populate({
      path: "variantId",
      select: "-__v -createdAt -updatedAt",
      populate: {
         path: "productId",
          model: "Product" ,
        select: "name slug brand category"
      }, // bring product details too
    })
    .lean();

  const subtotal = items.reduce((sum, item) => sum + item.variantId.price * item.quantity, 0)

  return {
    cartId: cart._id,
    items,
    subtotal,
    totalItems: items.length
  };
};




export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
};

// ✅ Add product variant to cart
export const addToCart = async (userId, variantId, quantity = 1) => {
  const cart = await getOrCreateCart(userId);

  const variant = await Variant.findById(variantId);
  if (!variant) {
    throw new Error("Variant not found");
  }

  let cartItem = await CartItem.findOne({ cartId: cart._id, variantId });
  const currentQty = cartItem ? cartItem.quantity : 0;
  const newQty = currentQty + quantity;

  // check stock
  if (newQty > variant.stock) {
    throw new Error("Not enough stock available");
  }

  if (cartItem) {
    cartItem.quantity = newQty;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      cartId: cart._id,
      variantId,
      quantity,
    });
  }

  return cartItem;
};


// Delete an item from the cart
export const removeFromCart = async (userId, variantId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found");
  }
 
  const cartItem = await CartItem.findOneAndDelete({
    cartId: cart._id,
    variantId,
  });

  if (!cartItem) {
    throw new Error("Item not found in cart");
  }

  return cartItem;
};