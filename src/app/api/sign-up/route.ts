import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import bcrypt from "bcryptjs"


export async function POST(request:Request){
    await dbConnect();

    try {
        const {username,email,password}=await request.json();
        const existingVerifiedUsername=await UserModel.findOne({
            username,
            isVerified:true,
        })

        if(existingVerifiedUsername){
            return Response.json({
                success:false,
                message:"Username is Already Exist "
            },{
                status:400
            })
        }
        const existingUserByEmail=await UserModel.findOne({email});
        let verifyCode=Math.floor(100000 + Math.random()*900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:"False",
                    message:"User already Exist with This email"
                },{
                    status:400
                })
            }else{
                const hashpassword=await bcrypt.hash(password,10);
                existingUserByEmail.password=hashpassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.VerifyCodeExpiry=new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }else{
            const hashpassword=await bcrypt.hash(password,10)
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1);


            const newUser=new UserModel({
                username,
                email,
                password:hashpassword,
                verifyCode,
                VerifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessages:true,
                messages:[]

            })

            await newUser.save()


        }
        //send verification email
        const emailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message,

            },{
                status:500
            })
        }
        return Response.json({
            success:true,
            message:'User registered Successfully.Please verify your account',

        },{
            status:201,
        }
    );
    } catch (error) {
             console.error('Error registrating user',error)
             return Response.json({
                success:false,
                message:"Something Went Wrong or Error while Registration"
             },{
                status:500
             }
            )  
    }
    
}