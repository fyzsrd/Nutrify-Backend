import * as profileService from '../../services/user/profile.service.js'


export const addOrUpdateUser = async (req, res) => {
    try {
        const userId = req.user.id
       
        const { firstName, lastName, email, gender, dob } = req.body

        if (!firstName || !lastName || !email) {

             return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        const userData = {firstName, lastName, email, gender, dob}

        const user = await profileService.addUser(userId, userData)

        res.status(201).json({ success: false, data: user });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}