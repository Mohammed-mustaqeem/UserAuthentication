import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const transport= nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:false, // Use `true` for port 465, `false` for all other ports
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // This ignores self-signed certificates
    }
})  