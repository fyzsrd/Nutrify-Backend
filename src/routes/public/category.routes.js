import express from "express";
import { getMainCategories, getSubCategories } from "../../controller/public/category.controller.js";

const router = express.Router();

// Main categories (parentCategory = null)
router.get("/", getMainCategories);

// Subcategories of a given category
router.get("/:id/subcategories", getSubCategories);

export default router;