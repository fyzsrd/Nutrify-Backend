import * as varientService from '../../services/admin/varient.service.js'
import fs from 'fs'

export const addVarient = async (req, res) => {

    try {
        const { productId,
            weight,
            weightType,
            flavor,
            mrp,
            price,
            stock,
            isBestSeller,
            isDefault,

        } = req.body


        if (!productId || !weight || !weightType || !flavor || !mrp || !price || !stock) {
            return res.status(400).json({ message: "Missing product details" });
        }

        const file = req.file



        const varientData = {
            productId,
            weight,
            weightType,
            flavor,
            mrp,
            price,
            stock,
            isBestSeller: isBestSeller || false,
            isDefault: isDefault || false,

        }
        const varient = await varientService.addVarient(productId, varientData, file)

        if (file) {
            fs.unlink(file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }

        res.status(201).json({
            status: true,
            data: varient
        })
    } catch (error) {
        res.status(500).json({ 
            message: "Internal server error",
             error: error.message });
    }
}

export const getvariants = async (req, res) => {

    try {

        const varients = await varientService.getvariants()


        res.status(201).json({
            succes: true,
            data: varients
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getVariant = async (req, res) => {

    try {

        const variantId = req.params.id;
        if (!variantId) throw new Error("varient i missing")


        const variant = await varientService.getVeriant(variantId)

        res.status(201).json({
            succes: true,
            data: variant
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
export const updateVariant = async (req, res) => {

    try {



        res.status(201).json({ message: "working on this" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const deleteVariant = async (req, res) => {

    try {

        const varientId = req.params.id;
        if (!varientId) return res.status(404).json({ success: false, message: 'varient Id required' });

        const deleted = await varientService.deleteVarient(varientId)

        if (!deleted) return res.status(404).json({ success: false, message: 'brand deletion issues' });

        res.status(201).json({
            succes: true

        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}



