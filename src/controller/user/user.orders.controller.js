import * as orderService from '../../services/user/user.order.service.js'

export const initiateOrder = async (req, res) => {
    try {
        const userId=req.user.id
        

        const result=await orderService.initiateOrder(userId)

        
        res.status(200).json({
            success: true,
            message: "Order initiation successful",
            data: result,
        })

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to initiate order",
        });
    }
}