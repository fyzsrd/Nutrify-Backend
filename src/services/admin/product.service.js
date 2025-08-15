import Product from '../../models/admin/Product.js';


export const addProduct = async (data) => {
    const existing = await Product.findOne({ name: data.name });
    if (existing) throw new Error("Product already exists");

    const product = new Product(data)

    return await product.save()

}

export const getAllProducts = async () => {
    const products = await Product.find({}).select('-__v -createdAt -updatedAt')
    if (!products) throw new Error("no product available")
    return products;
}


export const getProduct = async (productId) => {
    const product = await Product.findById(productId).select('-__v -createdAt -updatedAt')
    if (!product) throw new Error("no product available")
    return product;
}

export const updateProduct = async (productId, updateData, options = {}) => {
    const existing = await Product.findById(productId);
    if (!existing) throw new Error("Couldn't find product");

    // Handle images only if provided
    if (updateData.images !== undefined) {
        const newImages = Array.isArray(updateData.images)
            ? updateData.images
            : [updateData.images];

        if (options.replaceImages) {
            await Product.updateOne(
                { _id: productId },
                { $set: { images: newImages } }
            );
        } else {
            await Product.updateOne(
                { _id: productId },
                { $addToSet: { images: { $each: newImages } } }
            );
        }

        delete updateData.images; // Prevent overwriting with $set later
    }

    // Update other fields
    const updated = await Product.findByIdAndUpdate(
        productId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updated;
};


export const deleteProduct = async (productId) => {
    const existing = await Product.findById(productId);
    if (!existing) throw new Error("Product doesn't exist");

    const deleted = await Product.findByIdAndDelete(productId);
    return deleted;
};




export const getProductsWithVarient = async () => {

    const productsWithVarient=await Product.find({})
    .select('-__v -createdAt -updatedAt')
    .populate({
        path:'variants',
        select:'-__v -createdAt -updatedAt'
    })
    
    return productsWithVarient
}