import Joi from "joi";

export const AuctionSchema = Joi.object({
	startingPrice: Joi.number().required().messages({
		"number.empty": "Starting Price is required",
	}),
	currentPrice: Joi.number().required().messages({
		"number.empty": "Current Price is required",
	}),
	startDate: Joi.string().required().messages({
		"string.empty": "startDate is required",
	}),
	endDate: Joi.string().required().messages({
		"string.empty": "endDate is required",
	}),
	
});