import mongoose from  "mongoose";

const {Schema} =mongoose;

const cartSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required:true,
    },
    
},{
    timestamps:true,
})

const Cart=mongoose.model('Cart',cartSchema)

export default Cart;