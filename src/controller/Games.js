import { db } from "../database/database.connection.js";
import gameSchema from "../schema/GameSchema.js";

export async function getGames(req, res) {
    try {
        const games = await db.query('SELECT * FROM games;');
        res.send(games.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
export async function postGames(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    const validation = gameSchema.validate({name, image, stockTotal, pricePerDay}, {abortEarly: true})
    if (validation.error) {
        return res.sendStatus(400);
    }
    const nameExists = await db.query('SELECT * FROM games WHERE name = $1;', [name]);
    if (nameExists.rows[0]) return res.sendStatus(409).send("Game already exists")
    try {
        await db.query("INSERT INTO games (name, image, stockTotal, pricePerDay) VALUES ($1, $2, $3, $4);",
            [name, image, stockTotal, pricePerDay]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err);
    }
}