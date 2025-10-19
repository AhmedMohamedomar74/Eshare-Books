import { testConnection } from "./DB/connection.db.js"
import express from "express"
import path from "node:path"
import dotenv from "dotenv"



async function bootstrap() {
    dotenv.config({
        path: path.resolve("./config/dev.env")
    });
    const port = process.env.PORT
    const app = express()
    // DB
    testConnection()
    app.use(express.json())
    app.listen(port, () => {
        console.log(`Server is running on port = ${port}`)
    })
}

export default bootstrap