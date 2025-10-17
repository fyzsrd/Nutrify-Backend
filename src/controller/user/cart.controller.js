import * as cartService from '../../services/user/cart.service.js'

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id

        const cart = await cartService.getUserCartWithItems(userId)
        res.status(200).json({ status: true, data: cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


// Add product variant to cart
export const addItemToCart = async (req, res) => {
    try {
        const { variantId, quantity } = req.body;
        const userId = req.user.id; // assuming user is set from auth middleware

        const cartItem = await cartService.addToCart(userId, variantId, quantity);
        res.status(200).json({ success: true, data: cartItem });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const variantId  = req.params.id;

    const deletedItem = await cartService.removeFromCart(userId, variantId);
    res.status(200).json({ success: true, message: "Item removed", data: deletedItem });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//clear cart
export const clearUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(userId)
    const result = await cartService.clearCart(userId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const syncGuestCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const guestItems = req.body.items || [];
    const result = await cartService.syncCart(userId, guestItems);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


