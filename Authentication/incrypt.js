import bcrypt from 'bcrypt';

export const hashPassword = async(userPassword)=>{
    try {
        let hash = await bcrypt.hash(userPassword,10)
        return hash
    } catch (error) {
        console.log(error)
    }
}

export const comparePassword = async(userPassword,dbPassword)=>{
    try {
      const verifyPassword= await bcrypt.compare(userPassword,dbPassword)
        return verifyPassword
    } catch (error) {
        console.log(error)
    }
}