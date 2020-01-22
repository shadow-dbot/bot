const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const DB = require("./../../database");

module.exports = class suggestions extends Command {
	constructor(client) {
		super(client, {
			name: "activity",
			group: "creator",
			memberName: "activity",
			description: "Set's bot activity, Creator - Only",
			args: [
				{
					key: "query",
					prompt: "Please provide the activity",
					type: "string",
					validate: query => query.length > 3,
				},
			],
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, { query }) {
		try {
			this.client.user.setActivity(query);
			msg.reply("Updated!");
		} catch (e) {
			console.log(e);
			msg.reply("An error has occured, please try again later.");
		}
	}
};
