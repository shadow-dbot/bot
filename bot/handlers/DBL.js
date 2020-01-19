const DBL = require("dblapi.js");

const postServerCount = client => {
	if (process.env.NODE_ENV === "production") {
		const dbl = new DBL(process.env.DBL_API_KEY, client);

		dbl.on("posted", () => {});

		dbl.on("error", e => {
			console.log(`Oops! ${e}`);
		});
	}
};

module.exports = client => postServerCount(client);
