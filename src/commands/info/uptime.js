const { Command } = require("discord.js-commando");

module.exports = class upTimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "uptime",
			aliases: ["running", "up"],
			memberName: "uptime",
			group: "info",
			description: "Sends the bot's uptime.",
		});
	}
	run(message) {
		let seconds = parseInt((this.client.uptime / 1000) % 60),
			minutes = parseInt((this.client.uptime / (1000 * 60)) % 60),
			hours = parseInt((this.client.uptime / (1000 * 60 * 60)) % 24);

		hours = hours < 10 ? "0" + hours : hours;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		return message.say(
			`:chart_with_upwards_trend: I've been running for **${hours}** hours, **${minutes}** minutes!`
		);
	}
};
