import { Router } from "express";
import { getRentals, postRentals, finalizedRental } from "../controller/Rentals.js";
import validateSchema from "../middleware/validateSchema.js"
import rentalSchema from "../schema/RentalSchema.js";

const rentalsRoute = Router();

rentalsRoute.get("/rentals", getRentals);
rentalsRoute.post("/rentals", validateSchema(rentalSchema),postRentals);
rentalsRoute.post("/rentals/:id/return", finalizedRental);

export default rentalsRoute;