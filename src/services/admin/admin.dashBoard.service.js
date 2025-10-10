import Product from "../../models/admin/Product.js";
import Variant from "../../models/admin/Variant.js";
import User from "../../models/user/User.model.js";

export const getDashboardStats = async ()=>{
    const userCount=await User.countDocuments()
    const productCount=await Product.countDocuments()
    const order=555
    const revenue=55555
    const growth=5

    const dashStats={
        userCount,
        productCount,
        order,
        revenue,
        growth

    }
    return dashStats
}