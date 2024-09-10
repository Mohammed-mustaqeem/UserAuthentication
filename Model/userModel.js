import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    name:{type: String, required: true, trim:true},
    email:{type: String,required: true, },
    mobileNumber:{type: Number, required: true},
    password:{type: String,required: true},
})

const userModel = mongoose.model('user',userSchema,'user')

export default userModel;