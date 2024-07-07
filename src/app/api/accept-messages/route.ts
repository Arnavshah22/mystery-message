import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect();

    const session=await getServerSession(authOptions);
    const user:User=session?.user;
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated",
        },{
            status:401,
        })
    }

    const userId=user._id;
    const {acceptMessages}=await request.json()
    try {
        //update the user's message acceptance status
        const updatedUser=await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages:acceptMessages,
            },{
                new:true
            }

        );
        if(!updatedUser){
               //User not FOund 
               return Response.json({
                success:false,
                message:"Unable to find user to update the message acceptance status"
               },{
                status:404
               }
            );
        }

        //successfully updated message acceptance status
        return Response.json({
            success:true,
            message:"Message acceptance status updated Successfully",

        },{
            status:201,
        })

    } catch (error) {
        console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
    }
}

export async function GET(request:Request){
    //connect to db
    await dbConnect();

    //get the user session
    const session=await getServerSession(authOptions);
    const user=session?.user;

    if(!session || !user){
        return Response.json({
            success:false,
            messsage:"Not authenticated",

        },{
            status:401,

        })
    }
    try {
        //retrive the user from the database using the id
        const founduser=await UserModel.findById(user._id)

        if(!founduser){
             return Response.json({
                success:true,
                message:"User not Found",

             },{
                status:404
             })
        }
        //return the user's message acceptance status
        return Response.json({
            success:true,
            isAcceptingMessages:founduser.isAcceptingMessages,

        },{
            status:200
        })
    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
          { success: false, message: 'Error retrieving message acceptance status' },
          { status: 500 }
        );
        
    }

}