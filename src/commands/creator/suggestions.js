const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const DB = require("./../../database");

module.exports = class suggestions extends Command {
	constructor(client) {
		super(client, {
			name: "suggestions",
			group: "creator",
			memberName: "suggestions",
			description: "List all suggestions, Creator - Only ",
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg) {
		try {
			const suggestions = await DB.Suggestion.find({}).countDocuments();

			msg.reply(`Theres ${suggestions} suggestions`);
		} catch (e) {
			console.log(e);
			msg.reply("An error has occured, please try again later.");
		}
	}
};
