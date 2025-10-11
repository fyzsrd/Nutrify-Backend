import * as dashBaordService from '../../services/admin/admin.dashBoard.service.js'

export const getDashboardStats=async (req , res)=>{
   try{
    const dashStats=await dashBaordService.getDashboardStats()
    res.status(200).json({
        success:true,
        data:dashStats
    })
   } catch(error){
    res.status(500).json({
        success:false,
        error:error
    })
   }
}