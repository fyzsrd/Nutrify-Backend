import * as adminUserService from '../../services/admin/admin.users.service.js'


export const getAllUsers = async (req,res)=>{
    try{

        const usersData=await adminUserService.getAllUsers()


         res.status(201).json({
            succes: true,
            data: usersData
        })

    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}



export const getUserById = async (req,res)=>{
    try{
        const userId=req.params.id


        const userData=[] ///add service logic

         res.status(201).json({
            succes: true,
            data: userData
        })

    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}