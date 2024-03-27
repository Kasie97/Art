import Joi from "joi";

export const loginSchema = Joi.object().keys({
	email: Joi.string().trim().lowercase().required(),
	password: Joi.string()
		.min(3)
		.max(30)
		.regex(/^[a-zA-Z0-9@!#$%^&*]+$/)
		.required()
		.label("password")
		.messages({
			"string.base": "{{#label}} must have one uppercase and one lowercase",
			"string.pattern.base": "{{#label}} must have one special character",
			"any.required": "{{#label}} is required",
		}),
});