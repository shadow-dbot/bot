const { Command } = require("discord.js-commando");

const DB = require("../../../database");

module.exports = class suggestion extends Command {
	constructor(client) {
		super(client, {
			name: "suggestion",
			group: "misc",
			aliases: ["suggest", "idea"],
			memberName: "suggest",
			description: "Have a suggestion? ",
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
			console.log(query);

			console.log(msg.guild);

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

			msg.reply("Thanks for the suggestion!");
		} catch (e) {
			console.log(e);
			msg.reply("An error has occured, please try again later.");
		}
	}
};
