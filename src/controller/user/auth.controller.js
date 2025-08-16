import * as authService from '../../services/user/auth.service.js'


export const generateOtp = async (req,res)=>{
    try{

        const otp=12354

        res.status(200).json({succes:true,
            Otp:otp
        })

    }catch(error){
        res.status(500).json({succes:false ,
            message:error.message
        })
    }
}