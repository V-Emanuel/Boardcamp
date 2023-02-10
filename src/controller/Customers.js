import { db } from "../database/database.connection.js";
import gameSchema from "../schema/GameSchema.js";

export async function getCustomers(req, res) {
    try {
        const customers = await db.query('SELECT * FROM customers;');
        res.send(customers.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const customer = await db.query("SELECT * FROM customers WHERE id = $1;", [id])
        if (!customer.rows[0]) return res.sendStatus(404)
        res.send(customer.rows[0])
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const validation = gameSchema.validate({ name, phone, cpf, birthday }, { abortEarly: true });
    if (!validation.error) {
        return res.sendStatus(400);
    }
    const existingCpf = await db.query(
        'SELECT * FROM customers WHERE cpf = $1;',
        [cpf]
    );
    if (existingCpf.rowCount > 0) {
        return res.sendStatus(409);
    }
    try {
        await db.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);",
            [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function putCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;
    const validation = gameSchema.validate({ name, phone, cpf, birthday }, { abortEarly: true });
    if (!validation.error) {
        return res.sendStatus(400);
    }
    const existingCpf = await db.query(
        'SELECT * FROM customers WHERE cpf = $1;',
        [cpf]
    );
    if (existingCpf.rowCount > 0) {
        return res.sendStatus(409);
    }
    try {
        await db.query('UPDATE customers SET name = $1 WHERE id = $2;', [name, id]);
        await db.query('UPDATE customers SET phone = $1 WHERE id = $2;', [phone, id]);
        await db.query('UPDATE customers SET cpf = $1 WHERE id = $2;', [cpf, id]);
        await db.query('UPDATE customers SET birthday = $1 WHERE id = $2;', [birthday, id]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err);
    }
}