import mongoose from 'mongoose';
import * as productService from '../../services/admin/product.service.js';
import slugify from 'slugify';
import fs from 'fs' 

/**
 * Add product
 */
export const addProduct = async (req, res) => {
  try {
    console.log(">>> addProduct req.body:", req.body);
    console.log(">>> addProduct req.files:", req.files?.map(f => ({ path: f.path, originalname: f.originalname })) );

    const {
      name,
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
      isActive,
    } = req.body;

    if (!name || !brand || !category) {
      // remove any uploaded temp files
      if (req.files?.length) req.files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
      return res.status(400).json({ success: false, message: "Name, brand and category are required" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const productData = {
      name: name.trim(),
      slug,
      brand,
      category,
      isPromoted: isPromoted === "true" || isPromoted === true,
      isTested: isTested === "true" || isTested === true,
      description: description?.trim(),
      howtoUse: howtoUse?.trim(),
      countryInfo: countryInfo?.trim(),
      manufactureInfo: manufactureInfo?.trim(),
      // keep fssaiNumber as-is (service will coerce/validate)
      fssaiNumber: fssaiNumber ?? null,
      importerInfo: importerInfo?.trim(),
      isActive: isActive === "true" || isActive === true,
    };

    const product = await productService.createProduct(productData, req.files || []);

    // delete local temp files (they are already uploaded to Cloudinary)
    if (req.files?.length) {
      req.files.forEach((file) => { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); });
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // cleanup local files in case of error
    if (req.files?.length) {
      req.files.forEach((file) => { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); });
    }
    console.error("Add Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

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

// admin panel links

//get products details
export const getPanelProducts = async (req, res) => {
  try {
    const productsData = await productService.getPanelProducts();

    res.status(200).json({
      status: true,
      data: productsData,
    });
  } catch (error) {
    console.error("Error fetching panel products:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPanelProductDetails = async (req, res) => {
  try {
    const productId=req.params.id;

    const productData = await productService.getPanelProductDetails(productId);

    res.status(200).json({
      status: true,
      data: productData,
    });
  } catch (error) {
    console.error("Error fetching panel products:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};