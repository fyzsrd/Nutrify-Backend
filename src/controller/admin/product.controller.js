import mongoose from 'mongoose';
import * as productService from '../../services/admin/product.service.js';
import slugify from 'slugify';

export const addProduct = async (req, res) => {

    try {
        const { name,
            brand,
            category,
            isPromoted,
            isTested,
            description,
            howtoUse,
            countryInfo,
            manufactureInfo,
            fssaiNumber,
            importerInfo,
            images,
            thumbnail,
            isActive
        } = req.body;

        if (!name || !brand || !category) {
            return res.status(400).json({ message: "Missing required product details" });
        }

        const slug = slugify(name, { lower: true, strict: true })

        const product = await productService.addProduct({

            name: name.trim(),
            slug,
            brand,
            category,
            isPromoted: !!isPromoted,
            isTested: !!isTested,
            description: description?.trim(),
            howtoUse: howtoUse?.trim(),
            countryInfo: countryInfo?.trim(),
            manufactureInfo: manufactureInfo?.trim(),
            fssaiNumber,
            importerInfo: importerInfo?.trim(),
            images: Array.isArray(images) ? images : images ? [images] : [],
            thumbnail,
            isActive: !!isActive

        })
        console.log("controller service returned product" + product)
        res.status(201).json({
            status: true,
            message: "product added succesfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });

    }


}

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts()
        res.status(200).json({
            status: true,
            data: products
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) res.status(400).json({ message: "need product id" })

        const product = await productService.getProduct(productId)
        res.status(200).json({
            status: true,
            data: product
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({ message: "need product id" });
        }
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const allowedKeys = [
            'name', 'brand', 'category', 'isPromoted', 'isTested',
            'description', 'howtoUse', 'countryInfo', 'manufactureInfo',
            'fssaiNumber', 'importerInfo', 'images', 'thumbnail', 'isActive'
        ];

        const updateData = {};
        allowedKeys.forEach(key => {
            if (req.body[key] !== undefined) {

                if (typeof req.body[key] === 'string') {
                    updateData[key] = req.body[key].trim()
                } else {
                    updateData[key] = req.body[key];
                }

            }
        });

        const replaceImages = req.body.replaceImages === true || req.body.replaceImages === 'true'

        const product = await productService.updateProduct(productId, updateData, { replaceImages });

        res.status(200).json({
            status: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        await productService.deleteProduct(productId);

        res.status(200).json({
            status: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getProductsWithVarient = async (req, res) => {
    try {

        const productsWithVarient = await productService.getProductsWithVarient()
        res.status(200).json({
            status: true,
            data: productsWithVarient
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getProductWithVariant = async (req, res) => {
  try {
    const productId = req.params.id;
    const productWithVariant =await productService.getProductWithVariant(productId)

   
    res.status(200).json({
      status: true,
      data: productWithVariant,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};