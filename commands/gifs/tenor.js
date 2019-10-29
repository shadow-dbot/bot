const fetch = require("node-fetch");
const { tenorAPI } = require("../../config/key.js");
const { Command } = require("discord.js-commando");

module.exports = class tenorCommand extends Command {
	constructor(client) {
		super(client, {
			name: "tenor",
			group: "gifs",
			aliases: ["gif", "search-gif"],
			memberName: "tenor",
			description: "Provide a query and I'll look for it on tenor!",
			throttling: {
				usages: 1,
				duration: 4,
			},
			args: [
				{
					key: "text",
					prompt: "What gif would you like to see",
					type: "string",
					validate: text => text.length < 50,
				},
			],
		});
	}

	run(message, { text }) {
		fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=${text}&limit=1`)
			.then(res => res.json())
			.then(json => message.say(json.results[0].url))
			.catch(e => {
				message.say("Failed to find a gif on tenor that matched your query");
				return console.error(e);
			});
	}
};
