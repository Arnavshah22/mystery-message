import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResonse";


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,

):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from:'dev@hiteshchaudhary.com',
            to:email,
            subject:'Mystry Message Verification Code',
            react:VerificationEmail({username,otp:verifyCode}),

        });

      return {success:true,message:'Verificatin email sent successfully'}
    } catch (error) {
        console.error('Error sending verification email',error)
        return {success:false,message:'Failed to send verification Email'}
    }
}