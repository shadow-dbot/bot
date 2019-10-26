const fetch = require("node-fetch");
const { Command } = require("discord.js-commando");

module.exports = class darkJokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "darkjoke",
			aliases: ["darkjoke"],
			group: "misc",
			memberName: "darkjoke",
			description:
				"Warning, These jokes might be really really dark. Replies with a dark joke",
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	run(msg) {
		fetch(`https://sv443.net/jokeapi/category/Any`)
			.then(res => res.json())
			.then(json => {
				json.type === "single"
					? msg.reply(json.joke)
					: msg.reply(json.setup + "\n" + json.delivery);
			})
			.catch(e => {
				msg.say("Request to find a dark joke failed :(");
				return console.error(e);
			});
	}
};
