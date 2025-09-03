
import * as  publicProductService from '../../services/public/public.product.service.js'

export const getProductsByCategory = async (req , res )=>{
    try{
        const categoryId = req.params.id
        

        const products = await publicProductService.getProductsByCategory(categoryId);
        
        if(!products) throw new Error("no Products on this category")

        res.json({
            success:true,
            data:products
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const sample = async (req , res )=>{ }