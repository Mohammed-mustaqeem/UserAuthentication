import jwt from 'jsonwebtoken';
import userModel from '../Model/userModel.js';



export const jwtToken = (payload,privateKey)=>{
    let token = jwt.sign(payload,privateKey)
    return token;
}

export const verifyToken_Middleware = async(req,res,next)=>{
   try {
    // get token from header
    const authHeader = req.headers.authorization;
    // console.log(authHeader)
    if (!authHeader) {
        return res.status(401).send({ status: 'failed', message: 'Authorization header is missing' });
    }
    let bearer= authHeader.split(' ')[1]    

    // verify token
    let {id} = await jwt.verify(bearer,process.env.PRIVATE_KEY)
    
    // get user from token
    req.user= await userModel.findById(id)
    next()
   } catch (error) {
    console.log(error)
    res.status(404).send({status:'failed', message:'Unauthorized User, No Token'})
   }
}