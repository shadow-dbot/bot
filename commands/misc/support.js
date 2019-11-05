const { Command } = require("discord.js-commando");
const { support_link } = require("../../config/key");

module.exports = class supportCommand extends Command {
	constructor(client) {
		super(client, {
			name: "support",
			aliases: ["helpme", "supportme", "support"],
			group: "misc",
			memberName: "support",
			description: "Support link",
			throttling: {
				usages: 1,
				duration: 60,
			},
		});
	}

	run(msg) {
		msg.reply(support_link);
	}
};
