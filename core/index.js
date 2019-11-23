require("dotenv").config();

require("../database");

const app = require("express")();
const Commando = require("discord.js-commando");

const client = new Commando.Client({
	commandPrefix: process.env.PREFIX,
	owner: process.env.BOT_OWNER,
});

client.login(process.env.BOT_TOKEN);

require("../bot/")(app, client);
require("../web/")(app, client);
