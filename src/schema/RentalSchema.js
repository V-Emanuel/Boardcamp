import joi from "joi";

const rentalSchema = joi.object({
    daysRented: joi.number().greater(0).required()
});

export default rentalSchema;