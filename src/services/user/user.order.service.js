import Product from "../../models/admin/Product.js";
import CartItem from "../../models/user/carItem.model.js";
import Cart from '../../models/user/cart.model.js';
import ApiError from "../../utils/ApiError.js";

export const initiateOrder = async (userId) => {
    // 1️⃣ Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new ApiError(400, "No cart found for this user");

    // 2️⃣ Get cart items with variant and product details
    const cartItems = await CartItem.find({ cartId: cart._id })
        .populate({
            path: 'variantId',
            select: "price sku stock weight weightType flavor mrp productId",
            populate: {
                path: 'productId',
                select: 'name slug brand category isActive'
            }
        });

    if (cartItems.length === 0) throw new ApiError(400, "Cart is empty");

    // 3️⃣ Check stock & prepare order items
    let totalAmount = 0;
    const orderItems = [];
    const removedItems = [];

    for (const item of cartItems) {
        const variant = item.variantId;

        // ⚠️ If variant is missing or stock < requested quantity
        if (!variant || variant.stock < item.quantity) {
            // Remove from cart automatically
            await CartItem.findByIdAndDelete(item._id);

            removedItems.push({
                productId: variant?.productId?._id || null,
                productName: variant?.productId?.name || "Unknown Product",
                availableStock: variant?.stock || 0,
                variantId: variant?._id,
            });

            continue; // Skip to next item
        }

        // Valid item
        const subtotal = variant.price * item.quantity;
        totalAmount += subtotal;

        

        orderItems.push({
            productId: variant.productId._id,
            productName: variant.productId.name,
            variantId: variant._id,
            varianSku: variant.sku,
            weight: variant.weight,
            weightType: variant.weightType,
            flavor: variant.flavor,
            price: variant.price,
            quantity: item.quantity,
            subtotal,
        });
    }

    if (orderItems.length === 0) {
        throw new ApiError(400, "All items in your cart are out of stock");
    }

    // 4️⃣ Return summary
    return {
        orderItems,
        totalAmount,
        removedItems, // optional: frontend can show warning
    };
};
