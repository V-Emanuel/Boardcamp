import { Router } from "express";
import { getRentals, postRentals } from "../controller/Rentals.js";
import validateSchema from "../middleware/validateSchema.js"
import rentalSchema from "../schema/RentalSchema.js";

const rentalsRoute = Router();

rentalsRoute.get("/rentals", getRentals);
rentalsRoute.post("/rentals", postRentals);

export default rentalsRoute;