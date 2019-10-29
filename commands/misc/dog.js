const fetch = require("node-fetch");
const { tenorAPI } = require("../../config/key");
const { Command } = require("discord.js-commando");

module.exports = class dogCommand extends Command {
	constructor(client) {
		super(client, {
			name: "dog",
			aliases: ["dog-pic", "dogs"],
			group: "misc",
			memberName: "dog",
			description: "Replies with a cute dog picture",
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	run(message) {
		fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=dog&limit=1`)
			.then(res => res.json())
			.then(json => message.say(json.results[0].url))
			.catch(e => {
				message.say("Request to find a doggo failed :(");
				return console.error(e);
			});
	}
};
