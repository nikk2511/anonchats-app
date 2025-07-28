import mongoose from "mongoose";

type ConnectionObject = {
    isConnected ?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>
{
    if(connection.isConnected)
    {
        console.log('Already connected to Database')
        return; 
    }
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set');
        throw new Error('MONGODB_URI environment variable is not set');
    }
    try {
        // console.log(process.env.MONGODB_URI)
        const db = await mongoose.connect(process.env.MONGODB_URI! || '', {})

        connection.isConnected = db.connections[0].readyState

        console.log("DB connected Successfully");

    } catch (error: any) {
        console.log('DataBase connection failed', error.message);
        connection.isConnected = 0; // Reset connection status
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

export default dbConnect;