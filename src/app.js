import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import gamesRoutes from "./routes/gamesRoutes.js"
import customersRoute from './routes/customersRoutes.js'


dotenv.config()
const port = process.env.PORT || 5001;
const app = express();
app.use(cors());
app.use(express.json());

app.use([gamesRoutes, customersRoute]);
app.listen(port, () => console.log(`Server running in port ${port}`))