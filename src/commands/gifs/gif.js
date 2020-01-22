const fetch = require("node-fetch");
const { Command } = require("discord.js-commando");

const tenorAPI = process.env.TENOR_API;

module.exports = class gifCommand extends Command {
	constructor(client) {
		super(client, {
			name: "gif",
			group: "gifs",
			aliases: ["tenor", "search-gif"],
			memberName: "tenor",
			description: "Sends a random gif or provide a search query - Uses Tenor API",
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
