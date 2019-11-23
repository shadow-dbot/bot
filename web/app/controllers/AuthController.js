const jwt = require("jsonwebtoken");
const db = require("../../../database");

exports.register = async (req, res, next) => {
	let { name, email, password, password2 } = req.body;

	let errors = [];

	if (!name || !email || !password || !password2) {
		errors.push({
			msg: "Please enter all fields",
		});
	} else {
		email = email.toLowerCase();
		if (password != password2) {
			errors.push({
				msg: "Passwords do not match",
			});
		}

		if (password.length < 6) {
			errors.push({
				msg: "Password must be at least 6 characters",
			});
		}
	}

	if (errors.length > 0) {
		return res.status(417).json({
			errors,
			name,
			email,
			password,
			password2,
		});
	} else {
		const user = await db.User.findOne({
			email,
		});
		if (user) {
			errors.push({
				msg: "Email is already registered",
			});
			res.status(409).json({
				errors,
				name,
				email,
				password,
				password2,
			});
		} else {
			const newUser = new db.User({
				name,
				email,
				password,
			});

			await newUser.save();

			let token = await jwt.sign(
				{
					id: newUser._id,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: "1d",
				}
			);

			let user = await db.User.findById(newUser._id).select("name");

			return res.status(201).json({
				token,
				user,
			});
		}
	}
};

exports.login = async (req, res, next) => {
	let { email, password } = req.body;

	if (!password || !email) return res.status(417).json({ error: "Please enter all fields" });

	let foundUser = await db.User.findOne({
		email: email.toLowerCase(),
	});

	if (!foundUser) {
		return res.status(404).json({
			error: "User doesn't exist",
		});
	}

	let auth = await foundUser.comparePassword(password);

	if (!auth) {
		return res.status(406).json({
			error: "Password is incorrect",
		});
	}

	let token = await jwt.sign(
		{
			id: foundUser._id,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "1d",
		}
	);

	res.status(200).json({
		token,
		user: {
			_id: foundUser._id,
		},
	});
};
