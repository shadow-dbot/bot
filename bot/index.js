const Handlers = require("./handlers/");

const init = (app, client) => {
	Handlers(client);
};

module.exports = (app, client) => {
	init(app, client);
};
