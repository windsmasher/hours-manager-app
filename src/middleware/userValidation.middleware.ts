import joi from "@hapi/joi";
import express from "express";

function validateUser(): express.RequestHandler {
    return (request, response, next) => {
        const userValidationSchema = {
            login: joi.string().min(6).required().email(),
            password: joi.string().min(6).required()
        }
        const { error } = joi.validate(request.body, userValidationSchema)
        if (error) return response.status(400).send(error.details[0].message);
        next();
    }
}

export default validateUser;