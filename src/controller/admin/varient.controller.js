import * as varientService from '../../services/admin/varient.service.js'


export const addVarient =async (req,res)=>{

    try{
        const {productId,weight,weightType,flavor,mrp,price,stock,isBestSeller,isDefault,images,sku}=req.body

        if(!productId || !weight || !weightType|| !flavor || !mrp || !price || !stock || !sku) throw new Error("misisng product details")


          const varientData={
                productId,
                weight,
                weightType,
                flavor,
                sku,
                mrp,
                price,
                stock,
                isBestSeller,
                isDefault,
                images
            }
            const varient=await varientService.addVarient(productId,varientData)

         res.status(201).json({status:true,
            data:varient})
    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getvariants =async (req,res)=>{

    try{

        const varients=await varientService.getvariants()


         res.status(201).json({succes:true,
            data:varients
         })
    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getVariant =async (req,res)=>{

    try{

        const variantId=req.params.id;
        if(!variantId) throw new Error("varient i missing")

            
        const variant=await varientService.getVeriant(variantId)

         res.status(201).json({succes:true,
            data:variant
         })
    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
export const updateVariant =async (req,res)=>{

    try{



         res.status(201).json({message:"working"})
    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const deleteVariant =async (req,res)=>{

    try{

        const varientId=req.params.id;

        const deleted = await varientService.deleteVarient(varientId)


         res.status(201).json({succes:true
            
         })
    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}



