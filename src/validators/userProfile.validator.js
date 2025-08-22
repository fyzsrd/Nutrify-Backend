
 const UserProfileValidator=(userData)=>{
    const forbiddenFields = ["phoneNumber", "isVerified", "isBlocked", "password"];
     const safeData = {};

     for (const key in userData){
        if(!forbiddenFields.includes(userData[key])){
            safeData[key] = userData[key]
        }
     }

  
   return safeData
}
export default UserProfileValidator