import { Router } from "express";
import {getGames, postGames} from "../controller/Games.js";
import validateSchema from "../middleware/validateSchema.js";
import gameSchema from "../schema/GameSchema.js";

const gamesRoutes = Router();

gamesRoutes.get("/games", getGames);
gamesRoutes.post("/games", validateSchema(gameSchema),postGames);

export default gamesRoutes;