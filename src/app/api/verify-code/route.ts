import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request){
    //connect to db
    await dbConnect();

    try {
        const {username,code}=await request.json();
        const decodeUsername=decodeURIComponent(username)
        const user=await UserModel.findOne({username:decodeUsername})

        if(!user){
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
              );
        }

        //check if this code is correct and not expired
        const iscodevalid=user.verifyCode===code;
        const iscodenotexpiry=new Date(user.VerifyCodeExpiry) > new Date()

        if(iscodevalid && iscodenotexpiry){
            //update the user's verification code
            user.isVerified=true,
            await user.save()


            return Response.json({
                success:false,
                message:"Account Verified Successfuly",

            },{
                status:201,
            })

        }else{
            return Response.json({
                success:false,
                message:"Incorrect Verification Code",
            },{
                status:201,
            })
        }

    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json(
          { success: false, message: 'Error verifying user' },
          { status: 500 }
        );
    }
}