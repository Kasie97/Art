import Joi from "joi";

export const ArtworkSchema = Joi.object({
	artName: Joi.string().min(4).max(20).required().messages({
		"any.required": "Art Name is required",
	}),
	description: Joi.string().min(20).max(255).required().messages({
		"string.empty": "Description is required",
		"string.min": "Description should have a minimum length of {#limit}",
		"string.max": "Description should have a maximum length of {#limit}",
	}),
	category: Joi.string()
		.valid("Nature", "Portrait", "Landscape", "Ancient", "Modern", "Oil on Canvas", "Pen and Ink", "Digital Paint")
		.required()
		.messages({
			"any.required": "Category is required",
			"any.only": "Invalid Category",
		}),
	artClass: Joi.string().valid("Sale", "Auction").required().messages({
		"any.required": "Art Class is required",
		"any.only": "Invalid Art Class",
	}),
	price: Joi.number().required().messages({
		"any.required": "Price is required",
		"number.base": "Price must be a number",
	}),
	imageUrl: Joi.string().uri().required().messages({
		"any.required": "Image URL is required",
		"string.uri": "Invalid Image URL",
	}),
});