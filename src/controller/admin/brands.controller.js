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

        let logoUrl = null;
        let logoPublicId=null

        if (req.file) {

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "brands",
            });

            logoUrl = result.secure_url;
            logoPublicId= result.public_id;

            //remove local temp file
            fs.unlinkSync(req.file.path)   
        }

        const brand = await brandService.createBrand({
            name,
            description,
            fromTheBrand,
            logo: logoUrl,
            logoPublicId
        });

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

        const brand = await brandService.getBrandById(brandId);

        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found" });
        }


        // If a new logo is uploaded
        const updateData = { ...req.body };

        if (req.file) {
            //delete old logo if it exist
            if (brand.logoPublicId) {
                await cloudinary.uploader.destroy(brand.logoPublicId)
            }

            //upload new logo
            const result = cloudinary.uploader.upload(req.file.path, {
                folder: "brands",
            });


            uploadData.logo = result.secure_url;
            fs.unlinkSync(req.file.path)
        }


        const updatedBrand = await brandService.updateBrand(
            brandId,
            updateData

        );


        if (!updatedBrand)
            return res
                .status(404)
                .json({ success: false, message: 'Brand not found' });

        res.json({ success: true, data: updatedBrand });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

//delete Brand
export const deleteBrand = async (req, res) => {
    try {
        const brandId = req.params.id
        if (!brandId) return res.status(404).json({ success: false, message: 'Brand Id required' });

        const brand = await brandService.getBrandById(brandId);
        if (!brand) {
            return res
                .status(404)
                .json({ success: false, message: "Brand not found" });
        }

         // If logo exists in Cloudinary, delete it
         if(brand.logoPublicId){
            await cloudinary.uploader.destroy(brand.logoPublicId)
         }

        const deleted = await brandService.deleteBrand(brandId);
        if (!deleted) return res.status(404).json({ success: false, message: 'brand deletion issues' });
        res.json({ success: true, message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};