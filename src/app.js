import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { db } from './database/database.connection.js'
import gamesRoutes from "./routes/gamesRoutes.js"


dotenv.config()
const port = process.env.PORT || 5001;
const app = express();
app.use(cors());
app.use(express.json());

app.use([gamesRoutes]);
app.listen(port, () => console.log(`Server running in port ${port}`))