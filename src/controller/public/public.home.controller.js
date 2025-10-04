// controllers/user/home.controller.js
import * as homeService from "../../services/public/public.home.service.js";

export const getHomeData = async (req, res) => {
    try {
        const data = await homeService.getHomeData();
        res.json({
            success: true,
            data: data,

        });

    } catch (error) {
        res.status(500).json({ message: "Failed to load home data" });
    }
};

export const getHomeProducts = async (req, res) => {
    try {
        const products = await homeService.getHomeProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to load products" });
    }
};




export const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;
    const productDetails = await homeService.getProductDetail(productId);

    if (!productDetails) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(productDetails);
  } catch (error) {
    console.error("getProductDetail error:", error);
    res.status(500).json({ message: "Failed to load product details" });
  }
};


export const fetchSubCategories = async (req, res) => {
  try {
    const categories = await categoryService.getSubCategories();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};