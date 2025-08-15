import Variant from '../../models/admin/Variant.js'
import Product from '../../models/admin/Product.js'

export const addVarient = async (productId, varientData) => {

    const existingProduct = await Product.findById(productId)
    if (!existingProduct) throw new Error("Product your doesnt exiist ")

    const existingVarient = await Variant.findOne({ sku: varientData.sku })
    if (existingVarient) throw new Error("Varient Already exist")

        console.log(varientData)
        const varient=await Variant.create(varientData)
        
        return varient

}

export const getvariants = async () => {

    const varients=await Variant.find({}).select("-__v -createdAt -updatedAt");
    if(!varients) throw new Error("hmmm")

    return varients
}

export const getVeriant = async (variantId) => {

     const existing = await Variant.findById(variantId)
    if(!existing) throw new Error("Varient Doesnt Exist")

    const variant = await Variant.findById(variantId).select('-__v -createdAt -updatedAt')
    return variant

}
export const updateVarient = async () => {

}
export const deleteVarient = async (variantId) => {
    const existing = await Variant.findById(variantId);
    if (!existing) throw new Error("Variant doesn't exist");

    return await Variant.findOneAndDelete({ _id: variantId });
};