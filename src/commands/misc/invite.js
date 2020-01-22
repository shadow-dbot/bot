const fetch = require("node-fetch");
const { Command } = require("discord.js-commando");

module.exports = class inviteCommand extends Command {
	constructor(client) {
		super(client, {
			name: "invite",
			aliases: ["invite", "invme", "botinv"],
			group: "misc",
			memberName: "invite",
			description: "Responds with the bots invite link",
			throttling: {
				usages: 1,
				duration: 60,
			},
		});
	}

	run(msg) {
		msg.reply(process.env.BOT_INVITE_LINK);
	}
};
