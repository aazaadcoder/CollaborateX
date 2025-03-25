import mongoose from "mongoose";
import { config } from "./app.config";

const connectDataBase = async () => {
try {
    const dbConnection = await mongoose.connect(config.MONGO_URI);
    console.log(`Connected to DB: ${dbConnection.connection.host}`);
} catch (error) {
    console.log(`Error in connecting to DB: ${error}`);
    process.exit(1);
}    
}

export default connectDataBase;