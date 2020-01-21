const { Command } = require("discord.js-commando");

module.exports = class supportCommand extends Command {
	constructor(client) {
		super(client, {
			name: "support",
			aliases: ["helpme", "supportme", "support"],
			group: "misc",
			memberName: "support",
			description:
				"Discord support server invite link, Incase the bots causing you troubles ;c",
			throttling: {
				usages: 1,
				duration: 60,
			},
		});
	}

	run(msg) {
		msg.reply(process.env.SUPPORT_LINK);
	}
};
