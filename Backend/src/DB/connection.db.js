import mongoose from 'mongoose';

export const testConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("mongoose connected successfully 👌")
    } catch (error) {
        console.log(`Failed to connect : ${error}`)
    }
}
