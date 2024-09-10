import { createUserService ,deleteUserService,getOneUserService,getUsersService,loginUserService, passwordResetEmailService, updateUserService, userPasswordResetService} from "../services/userService.js";
import userModel from "../Model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { comparePassword, hashPassword } from "../Authentication/incrypt.js";
import { jwtToken } from "../Middlewares/Jwt.js";
import { transport } from "../Config/emailConfig.js";

export const createUserController = async (req, res) => {
  try {
    const { name, email, mobileNumber, password, confirm_password } = req.body;
    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
      res.status(200).send({ status: "failed", message: "user alread exist" });
    } else {
      if (name && email && mobileNumber && password && confirm_password) {
        if (password == confirm_password) {
       
            const hashPass = await hashPassword(password)
          await createUserService(
           { name,
            email,
            mobileNumber,
            password:hashPass,
           }
          );
          res
            .status(201)
            .send({ status: "success", message: "User Create Successfully" });
        } else {
          res.status(400).send({
            status: "failed",
            message: "password and confirm_password doesn't matched",
          });
        }
      } else {
        res
          .status(400)
          .send({ status: "failed", message: "All Fields required" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email && password) {
            
            const findUser = await loginUserService(email);
            // console.log("userPass",findUser)
            if (findUser) { 
                const isMatch = await comparePassword(password, findUser.password);
                // console.log("password",isMatch)
                if ((findUser.email == email) && isMatch) {
                  //gentare token
                  const token = await jwtToken({id:findUser._id},process.env.PRIVATE_KEY)
                    res.status(200).send({ status: "success", message:` Login successful `, Token:`${token}` });
                } else {
                    res.status(401).send({ status: "failed", message: "Invalid email or password" });
                }
            } else {
                res.status(404).send({ status: "failed", message: "User not found" });
            }
        } else {
            res.status(400).send({ status: "failed", message: "All fields are required" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
};

export const getOneUserController = async(req,res)=>{
  try {
    const {id}=req.params;
    const findUser = await getOneUserService(id)
    if (findUser) {
      res.status(200).send({status:'success',message:`get one user successfully ${findUser}`})
    } else {
      res.status(404).send({status:'fields',message:`user not found`})     
    }
  } catch (error) {
    console.log(error.message)
  }
}

export const getUsersController = async(req,res)=>{
  try {
    const allUsers = await getUsersService()
    res.status(202).send({status:'success',message:`get all users ${allUsers}`})
  } catch (error) {
    console.log(error.message)
  }
}

export const deleteUserConttroller=async(req,res)=>{
try {
const {id} = req.params
  const deleteUser =await deleteUserService(id)
  res.status(202).send({status:'success',message:`user deleted Successfully ${deleteUser}`})
} catch (error) {
  console.log(error.message)
}
}

export const updateUserController= async(req,res)=>{
  try {
    const{mobileNumber,name}=req.body
    const updateUser=await updateUserService(req.params.id,req.body)
    if (updateUser) {
      return res.status(202).send({status:'success', message:`update user successfully`})
     } else {
      return res.status(400).send({status:'failes', message:`user not found`})   
     }
  } catch (error) {
    
  }
}

export const changePasswordContorller = async (req,res)=>{
  try {
    const{password,confirm_password}=req.body;
    if (password && confirm_password) {
      if (password === confirm_password) {
        const hash = await hashPassword(password)
        await userModel.findByIdAndUpdate(req.user._id,{password:hash})
      return res.status(200).send({status:'success', message:`password change successfully`})   
      } else {
      return res.status(400).send({status:'failes', message:`password and confirm_Password does not matched`})   
      }
    } else {
      return res.status(400).send({status:'failes', message:`All Feilds require`})   
    }
  } catch (error) {
    console.log(error)
  }
}

export const loggedUserController=(req,res)=>{
    res.status(200).send({status:'success', user : req.user})
} 

export const passwordResetEmail=async(req,res)=>{
  try {
    const {email} =req.body
    if (email) {
      const user=await passwordResetEmailService(email)
      if (user) {
        const secret = user._id + process.env.PRIVATE_KEY
        const token = jwtToken({userID:user._id},secret, {expiresIn : '15m'})
        const link = `http://127.0.0.1:3000/user/reset-password/${user._id}/${token}`
        console.log(link)
        //send email
        const info = await transport.sendMail({
          from:process.env.EMAIL_FORM,
          to: user.email,
          subject:"Tekisky-Meet, Password Reset Link",
          html:`<a href=${link}>Click her</a> to Reset your Password`
            })

    res.status(200).send({status:'success', message:"Password Reset Email sent... please check your Email"})
  
        
      } else {
    res.status(404).send({status:'Faild', message:"Email doesn't exist"})
      }
    } else {
    res.status(401).send({status:'Faild', message:"Email Field required"})
    }  
  } catch (error) {
    console.log(error.message)
  }
}

export const userPasswordReset=async(req,res)=>{
  try {
    const {password,confirm_password}=req.body
    const {id,token}=req.params
    const user = await userPasswordResetService(id)
    const secret = user._id + process.env.PRIVATE_KEY
    jwt.verify(token,secret)
    if (password && confirm_password) {
      if (password === confirm_password) {
        const hashPass = await hashPassword(password)
        await userModel.findByIdAndUpdate(user._id,{password:hashPass})
        return res.status(200).send({status:'success', message:`Password Reset successfull`})
      } else {
        return res.status(400).send({status:'failes', message:`password and confirm_Password does not matched`})
      }
    } else {
      return res.status(400).send({status:'failes', message:`All Feilds require`})  
    }
  } catch (error) {
    console.log(error)
  }
}