import { Router } from "express";
import { getRentals, postRentals, finalizedRental, deleteRental } from "../controller/Rentals.js";
import validateSchema from "../middleware/validateSchema.js"
import rentalSchema from "../schema/RentalSchema.js";

const rentalsRoute = Router();

rentalsRoute.get("/rentals", getRentals);
rentalsRoute.post("/rentals", validateSchema(rentalSchema),postRentals);
rentalsRoute.post("/rentals/:id/return", finalizedRental);
rentalsRoute.delete("/rentals/:id", deleteRental);

export default rentalsRoute;