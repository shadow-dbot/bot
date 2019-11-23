const index = client => {
	require("./Events")(client);
	require("./Registry")(client);
	require("./DBL")(client);
	require("./Structures")(client);
};

module.exports = client => index(client);
