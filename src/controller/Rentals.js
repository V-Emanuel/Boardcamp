import dayjs from "dayjs";
import { db } from "../database/database.connection.js";
import rentalSchema from "../schema/RentalSchema.js";

export async function getRentals(req, res) {

    const rentals = await db.query(`SELECT rentals.*, customers.id, customers.name AS "customers",
        games.id, games.name AS "games"
        FROM rentals 
        JOIN customers 
        ON "customerId" = customers.id 
        JOIN games 
        ON "gameId" = games.id;`);

    let rentalsArray = rentals.rows;

    const completeRental = rentalsArray.map(i => ({
        id: i.id,
        customerId: i.customerId,
        gameId: i.gameId,
        rentDate: i.rentDate,
        daysRented: i.daysRented,
        returnDate: i.returnDate,
        originalPrice: i.originalPrice,
        delayFee: i.delayFee,
        customer: {
            id: i.customerId,
            name: i.customers
        },
        game: {
            id: i.gameId,
            name: i.games
        }
    }))


    try {
        res.send(completeRental);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const customerExists = await db.query('SELECT * FROM customers WHERE id = $1;', [customerId]);
    if (!customerExists.rows[0]) return res.sendStatus(400);

    const game = await db.query('SELECT * FROM games WHERE id = $1;', [gameId])
    if (!game.rows[0]) return res.sendStatus(400);

    const validation = rentalSchema.validate({ customerId, gameId, daysRented }, { abortEarly: true });
    if (validation.error) return res.sendStatus(400);

    const gameAvailable = game.rows[0].stockTotal;
    if (gameAvailable == 0) return res.sendStatus(400);

    const originalPrice = game.rows[0].pricePerDay * daysRented;
    const rentDate = dayjs().format('YYYY-MM-DD');
    const returnDate = null;
    const delayFee = null;

    try {
        await db.query('UPDATE games SET "stockTotal" = $1 WHERE id = $2;', [game.rows[0].stockTotal - 1, gameId])
        await db.query(I`NSERT INTO rentals
            ("customerId", "gameId", "rentDate","daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finalizedRental(req, res) {
    const { id } = req.params;

    const rental = await db.query('SELECT * FROM rentals WHERE id = $1;', [id]);
    if (!rental.rows[0]) return res.sendStatus(404);
    if (rental.rows[0].returnDate != null) return res.sendStatus(400)

    const game = await db.query('SELECT * FROM games WHERE id = $1;', [rental.rows[0].gameId])

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().substring(0, 10);
    }

    let delayFeeNew = 0;
    const rentDate = rental.rows[0].rentDate;
    const returnDateFinal = dayjs().format('YYYY-MM-DD');
    let returnDateCorrect = addDays(rentDate, rental.rows[0].daysRented);

    if (returnDateFinal > returnDateCorrect) {
        let days = daysBetweenDates(returnDateFinal, returnDateCorrect);
        delayFeeNew = days * game.rows[0].pricePerDay;
    }

    try {
        await db.query('UPDATE rentals SET "returnDate" = $1 WHERE id = $2;', [returnDateFinal, id]);
        await db.query('UPDATE rentals SET "delayFee"= $1 WHERE id = $2;', [delayFeeNew, id]);
        res.sendStatus(200)
        console.log(delayFeeNew)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    const rental = await db.query('SELECT * FROM rentals WHERE id = $1;', [id]);
    if (!rental.rows[0]) return res.sendStatus(404);
    if (rental.rows[0].returnDate == null) return res.sendStatus(400);

    try {
        await db.query('DELETE FROM rentals WHERE id = $1;', [id]);
        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message);
    }

}