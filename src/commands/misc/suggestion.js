const { Command } = require("discord.js-commando");

const DB = require("./../../database");

module.exports = class suggestion extends Command {
	constructor(client) {
		super(client, {
			name: "suggestion",
			group: "misc",
			aliases: ["suggest", "idea"],
			memberName: "suggest",
			description: "Have a suggestion for the website or for a command? Let us know!",
			examples: ["suggest add more music commands"],
			throttling: {
				usages: 1,
				duration: 240,
			},
			args: [
				{
					key: "query",
					prompt: "Please provide the suggestion",
					type: "string",
					validate: query => query.length > 10,
				},
			],
		});
	}

	async run(msg, { query }) {
		try {
			const suggestion = await DB.Suggestion.findOne({ suggestion: query });

			if (suggestion) {
				return msg.reply(
					`Mhm, It seems there's already an identical suggestion.. Thanks tho!`
				);
			}

			const newSuggestion = new DB.Suggestion({
				suggestion: query,
				author: {
					name: msg.author.username,
					id: msg.author.id,
				},
			});

			await newSuggestion.save();

			this.client.users
				.get(process.env.BOT_OWNER, false)
				.send(
					`Hey! It's seems theres a new suggestion!\n${query}\nFrom: ${msg.author.tag}`
				);

			msg.reply("Thanks for the suggestion!");
		} catch (e) {
			console.log(e);
			msg.reply("An error has occured, please try again later.");
		}
	}
};
