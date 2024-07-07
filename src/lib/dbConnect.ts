import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}
const connection:ConnectionObject={}

async function dbConnect():Promise<void>{

    // Check if we have a connection to the database or if it's currently connecting
    if(connection.isConnected){
        console.log('Already connected to the database');
        return;    
    }
    try {
       const db= await mongoose.connect(process.env.MONGODB_URL || "",{});

       connection.isConnected=db.connections[0].readyState;

       console.log('Database connected Successfully');
    } catch (error) {
        console.error('Database Connection failed',error);

        process.exit(1);

    }
}
export default dbConnect;
