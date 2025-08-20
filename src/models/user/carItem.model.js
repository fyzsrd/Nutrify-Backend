import mongoose from "mongoose";

const { Schema } = mongoose;

const cartItemSchema = new Schema({
    cartId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'Cart'
    },
    variantId: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Variant'
    },
    quantity: {
        type: Number,
        required:true,
        min:1,
        default:1
    },
})

cartItemSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;   // 👈 removes from response
    return ret;
  }
});


 const CartItem = mongoose.model("CartItem", cartItemSchema);

 export default CartItem