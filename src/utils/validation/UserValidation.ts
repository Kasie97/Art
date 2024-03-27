import Joi from "joi";

export const option = {
	abortEarly: false,
	errors: {
		wrap: {
			label: "",
		},
	},
};

const passwordComplexityOptions = {
	min: 8, // Minimum length
	max: 30, // Maximum length
	lowerCase: 1, // Require at least 1 lowercase letter
	upperCase: 1, // Require at least 1 uppercase letter
	numeric: 1, // Require at least 1 digit
	symbol: 1, // Require at least 1 special character
};

const passwordSchema = Joi.string()
	.min(passwordComplexityOptions.min)
	.max(passwordComplexityOptions.max)
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{8,30}$/)
	.message(
		"Password must be between 8 and 30 characters, contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
	)
	.required();

export const registerUserSchema = Joi.object({
	firstname: Joi.string().min(4).max(30).required().messages({
		"string.empty": "First name is required",
		"string.min": "First name should have a minimum length of {#limit}",
		"string.max": "First name should have a maximum length of {#limit}",
	}),
	surname: Joi.string().min(4).max(30).required().messages({
		"string.empty": "Surname is required",
		"string.min": "Surname should have a minimum length of {#limit}",
		"string.max": "Surname should have a maximum length of {#limit}",
	}),
	email: Joi.string().email().required().messages({
		"string.empty": "Email is required",
		"string.email": "Invalid email format",
	}),
	phone: Joi.string()
		.length(11)
		.pattern(/^[0-9]+$/)
		.required()
		.messages({
			"string.empty": "Phone number is required",
			"string.length": "Phone number should have a length of {#limit}",
		}),
	role: Joi.string().valid("User", "Artist").required().messages({
		"string.empty": "Role is required",
		"any.only": "Invalid role",
	}),
	password: passwordSchema,
	confirmPassword: Joi.any().equal(Joi.ref("password")).required().label("Confirm password").messages({
		"any.only": "Passwords do not match",
		"any.required": "Password confirmation is required",
	}),
});


export const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"string.empty": "Email is required",
		"string.email": "Invalid email format",
	}),
	password: passwordSchema,
});
export const resetPasswordSchema = Joi.object({
	password: passwordSchema,
	confirmPassword: Joi.any().equal(Joi.ref("password")).required().label("Confirm password").messages({
		"any.only": "Passwords do not match",
		"any.required": "Password confirmation is required",
	}),
});

export const sendVerification = Joi.object().keys({
	email: Joi.string().trim().lowercase().email().required(),
	id: Joi.string().required(),
  });

  export const verifyCode = Joi.object().keys({
	email: Joi.string().trim().lowercase().email().required(),
	otp: Joi.number().required(),
  });

export const updateUserSchema = Joi.object({
     firstname: Joi.string().min(3).max(30).messages({
		"string.min": "firstname should have a minimum length of {#limit}",
		"string.max": "firstname should have a maximum length of {#limit}",
	 }),
	 surname: Joi.string().min(3).max(30).messages({
		"string.min": "surname should have a minimum length of {#limit}",
		"string.max": "surname should have a maximum length of {#limit}"
	 }),
	 email: Joi.string().email().messages({
		"string.email": "invalid email format"
	 }),
	 phone: Joi.string().length(11).pattern(/^[0-9]+$/).messages({
        "string.length": "phone number should have the length of {#limit}"
	 }),
	 oldPassword: Joi.string().min(passwordComplexityOptions.min)
	 .max(passwordComplexityOptions.max)
	 .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{8,30}$/)
	 .message(
		 "Password must be between 8 and 30 characters, contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
		 ),

	newPassword: Joi.string().min(passwordComplexityOptions.min)
	 .max(passwordComplexityOptions.max)
	 .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{8,30}$/)
	 .message(
		 "Password must be between 8 and 30 characters, contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
		 ),

	 password: Joi.string().min(passwordComplexityOptions.min)
	 .max(passwordComplexityOptions.max)
	 .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{8,30}$/)
	 .message(
		 "Password must be between 8 and 30 characters, contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
		 ),

	 confirmPassword: Joi.any().equal(Joi.ref("password")).required().label("Confirm password").messages({
		   "any.only": "Passwords do not match",
		   "any.required": "Password confirmation is required",
	   }),
});

export const updateProfileSchema = Joi.object({
	firstname: Joi.string().min(3).max(30).messages({
	   "string.min": "firstname should have a minimum length of {#limit}",
	   "string.max": "firstname should have a maximum length of {#limit}",
	}),
	surname: Joi.string().min(3).max(30).messages({
	   "string.min": "surname should have a minimum length of {#limit}",
	   "string.max": "surname should have a maximum length of {#limit}"
	}),
	phone: Joi.string().length(11).pattern(/^[0-9]+$/).messages({
	   "string.length": "phone number should have the length of {#limit}"
	}),
	email: Joi.string().email().messages({
		"string.email": "invalid email format"
	 }),

   birthday: Joi.date(),
   address: Joi.string(),
   state: Joi.string(),
   zipcode: Joi.number(),
   profilePic: Joi.string(),
});

export const changePasswordSchema = Joi.object({
	password: passwordSchema,
	newPassword: passwordSchema,
	confirmPassword: Joi.any().equal(Joi.ref("newPassword")).required().label("Confirm password").messages({
		"any.only": "Passwords do not match",
		"any.required": "Password confirmation is required",
	}),
});
