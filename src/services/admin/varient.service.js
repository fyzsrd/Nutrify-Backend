import Variant from '../../models/admin/Variant.js'
import Product from '../../models/admin/Product.js'
import cloudinary from '../../utils/cloudinary.js'
import Brands from '../../models/admin/Brands.js';



export const addVarient = async (productId, varientData, file) => {

    let imageUrl = null;
    let imagePublicId = null;

    try {
        const existingProduct = await Product.findById(productId).populate('brand')
        if (!existingProduct) throw new Error("Product doesn't exist")

        const duplicateVariant = await Variant.find({
            productId,
            weight: varientData.weight,
            weightType: varientData.weightType,
            flavor: varientData.flavor.toLowerCase().trim()

        })

        if (duplicateVariant.length > 0) {
            throw new Error("Variant with same weight & flavor already exists for this product")
        }


        
        // SKU generation
        const brandCode = existingProduct.brand?.name
            ? existingProduct.brand.name.substring(0, 3).toUpperCase()
            : "ITM"

        const nameParts = existingProduct.name.split(' ')
        const productCode = nameParts.map((w) => w[0]).join("").toUpperCase()

        const weightCode = `${varientData.weight}${varientData.weightType.toUpperCase()}`

        const flavorCode = varientData.flavor.substring(0, 4).toUpperCase()

        let sku = `${brandCode}-${productCode}-${weightCode}-${flavorCode}`




        // Ensure SKU is unique
        let existingVarient = await Variant.findOne({ sku })
        if (existingVarient) {
            const randomCode = Math.floor(100 + Math.random() * 900)
            sku = `${sku}-${randomCode}`
        }
        varientData.sku = sku
        varientData.flavor = varientData.flavor.toLowerCase().trim();


        if (file) {
            let result = await cloudinary.uploader.upload(file.path, {
                folder: "variants",
            })
            imageUrl = result.secure_url
            imagePublicId = result.public_id
        }

        varientData.images = imageUrl;
        varientData.imagePublicId = imagePublicId

        const isDefaultExists = await Variant.findOne({
            productId,
            isDefault: true
        });

        if (!isDefaultExists) {
            varientData.isDefault = true;
        }
        const varient = await Variant.create(varientData)

        return varient

    } catch (error) {
        if (imagePublicId) {
            await cloudinary.uploader.destroy(imagePublicId)
        }
        throw error

    }


}

export const getvariants = async () => {

    const varients = await Variant.find({}).select("-__v -createdAt -updatedAt");
    if (!varients) throw new Error("hmmm")

    return varients
}

export const getVeriant = async (variantId) => {

    const existing = await Variant.findById(variantId)
    if (!existing) throw new Error("Varient Doesnt Exist")

    const variant = await Variant.findById(variantId).select('-__v -createdAt -updatedAt')
    return variant

}
export const updateVarient = async () => {

}
export const deleteVarient = async (variantId) => {
    const variant = await Variant.findById(variantId);
    if (!variant) throw new Error("Variant doesn't exist");

    if(variant.imagePublicId){
        await cloudinary.uploader.destroy(variant.imagePublicId)
    }


    return await Variant.findOneAndDelete({ _id: variantId });
};