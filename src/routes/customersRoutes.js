import { Router } from "express";
import { getCustomers, getCustomerById, postCustomers, putCustomer } from "../controller/Customers.js";
import validateSchema from "../middleware/validateSchema.js"
import customerSchema from "../schema/CustomerSchema.js";


const customersRoute = Router();

customersRoute.get("/customers", getCustomers);
customersRoute.get("/customers/:id", getCustomerById);
customersRoute.post("/customers", validateSchema(customerSchema),postCustomers);
customersRoute.put("/customers/:id", validateSchema(customerSchema), putCustomer)

export default customersRoute;
