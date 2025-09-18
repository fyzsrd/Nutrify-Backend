import * as brandService from '../../services/admin/brands.service.js'
import cloudinary from '../../utils/cloudinary.js';
import fs from 'fs'

// Create brand

export const addBrand = async (req, res) => {
    try {
        const { name, description, fromTheBrand } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ success: false, message: "Brand name is required" });
        }


        const brand = await brandService.createBrand(
            {name,description, fromTheBrand },
            req.file?.path
        );

        if (req.file) fs.unlinkSync(req.file.path)

        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

//Get all brands
export const getBrands = async (req, res) => {
    try {
        const brands = await brandService.getAllBrands();
        res.json({ success: true, data: brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//Get brand by ID
export const getBrand = async (req, res) => {
    try {

        const brand = await brandService.getBrandById(req.params.id);
        if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
        res.json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update brand
export const updateBrand = async (req, res) => {
  try {
    const brandId = req.params.id;
    const updatedBrand = await brandService.updateBrand(
      brandId,
      req.body,
      req.file?.path
    );

    if (req.file) fs.unlinkSync(req.file.path);

    res.json({ success: true, data: updatedBrand });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

//delete Brand
export const deleteBrand = async (req, res) => {
    try {
        const brandId = req.params.id
        if (!brandId) return res.status(404).json({ success: false, message: 'Brand Id required' });


        const deleted = await brandService.deleteBrand(brandId);

        if (!deleted) return res.status(404).json({ success: false, message: 'brand deletion issues' });

        

        res.json({ success: true, message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBrandNames=async (req,res)=>{
    try {
        const brandsData=await brandService.getBrandNames()

        res.json({ success: true, data:brandsData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}