const fetch = require("node-fetch");
const { Command } = require("discord.js-commando");

module.exports = class JokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "joke",
			aliases: ["joke"],
			group: "misc",
			memberName: "joke",
			description: "Make a joke, Some might be a bit dark.",
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	run(msg) {
		fetch(`https://sv443.net/jokeapi/category/any`)
			.then(res => res.json())
			.then(json => {
				json.type === "single"
					? msg.reply(json.joke)
					: msg.reply(json.setup + "\n" + json.delivery);
			})
			.catch(e => {
				msg.say("Request to find a joke failed :(");
				return console.error(e);
			});
	}
};
