const fetch = require("node-fetch");
const { Command } = require("discord.js-commando");
const { bot_invite_link } = require("../../config/key");

module.exports = class inviteCommand extends Command {
	constructor(client) {
		super(client, {
			name: "invite",
			aliases: ["invite", "invme", "botinv"],
			group: "misc",
			memberName: "invite",
			description: "My invite link",
			throttling: {
				usages: 1,
				duration: 60,
			},
		});
	}

	run(msg) {
		msg.reply(bot_invite_link);
	}
};
