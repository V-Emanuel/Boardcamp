import joi from "joi";


const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
    cpf: joi.string().pattern(/^[0-9]+$/).length(11).required(),
    birthday: joi.date().iso().messages({'date.format': `Date format is YYYY-MM-DD`}).required()
})

export default customerSchema;