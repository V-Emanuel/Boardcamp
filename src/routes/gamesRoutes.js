import { Router } from "express";
import {getGames, postGames} from "../controller/Games.js";

const gamesRoutes = Router();

gamesRoutes.get("/games", getGames);
gamesRoutes.post("/games", postGames);

export default gamesRoutes;