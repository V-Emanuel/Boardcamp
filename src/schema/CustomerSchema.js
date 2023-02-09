import joi from "joi";


const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.number().min(10).max(11).required(),
    cpf: joi.string().min(11).max(11).required(),
    birthday: joi.date().less('2023-01-31').required()
})

export default customerSchema;