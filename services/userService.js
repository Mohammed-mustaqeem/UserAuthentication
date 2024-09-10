import userModel from "../Model/userModel.js";

export const createUserService = async(userData)=>{
    try {
        const create = await userModel(userData)
        const saveUser= await create.save()
        return saveUser
    } catch (error) {
        console.log(error)
    }
}

export const loginUserService =async(email)=>{
    try {
        const user = await userModel.findOne({email})
        return user
    } catch (error) {
        console.log(error.message)
    }
}

export const getOneUserService = async(id)=>{
    try {
        const user = await userModel.findById({_id:id})
        return user
    } catch (error) {
        console.log(error.message)
    }
}

export const getUsersService = async()=>{
    try {
        const user = await userModel.find()
        return user
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteUserService =async(id)=>{
try {
    const user = await userModel.findByIdAndDelete({_id:id})
return user
} catch (error) {
    console.log(error.message)
}
}

export const updateUserService=async(id,mobileNumber,name)=>{
    try {
        let user= await userModel.findByIdAndUpdate(id,mobileNumber,name)
        return user
    } catch (error) {
        console.log(error)
    }
}

export const resetPasswordService=async(email)=>{
    try {
        const user=await userModel.findOne({email:email})
        return user
    } catch (error) {
        
    }
}

export const passwordResetEmailService=async(email)=>{
    try {
        const user = await userModel.findOne({email:email})
        return user
    } catch (error) {
        console.log(error)
    }
}

export const userPasswordResetService=async(id)=>{
    try {
        const user = await userModel.findById(id)
        return user
    } catch (error) {
        console.log(error)
    }
}