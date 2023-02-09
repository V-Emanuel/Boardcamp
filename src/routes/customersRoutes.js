import { Router } from "express";
import { getCustomers, getCustomerById, postCustomers } from "../controller/Customers.js";

const customersRoute = Router();

customersRoute.get("/customers", getCustomers);
customersRoute.get("/customers/:id", getCustomerById);
customersRoute.post("/customers", postCustomers);

export default customersRoute;
