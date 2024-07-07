import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "User not Found",
        }, {
            status: 400
        })
    }
    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updateResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not Found or already deleted"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Message Deleted Successfully"
        }, {
            status: 201,
        })
    } catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
        );

    }
}