const fetch = require("node-fetch");
const { Command } = require("discord.js-commando");

module.exports = class momJokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "momjoke",
			aliases: ["mom"],
			group: "misc",
			memberName: "momjokes",
			description: "Responds with a random Mom Joke!",
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	run(message) {
		fetch(`https://insults.tr00st.co.uk/your_mom/`)
			.then(res => res.json())
			.then(json => message.reply(json))
			.catch(e => {
				message.say("Request to find a mom joke failed :(");
				return console.error(e);
			});
	}
};
