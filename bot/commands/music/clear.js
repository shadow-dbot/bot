const { Command } = require("discord.js-commando");

module.exports = class clearCommand extends Command {
	constructor(client) {
		super(client, {
			name: "clear",
			aliases: ["skipall"],
			memberName: "clear",
			group: "music",
			description: "Skip all songs in queue",
			guildOnly: true,
		});
	}

	run(message) {
		var voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.reply("Join a channel and try again");

		if (
			typeof message.guild.musicData.songDispatcher == "undefined" ||
			message.guild.musicData.songDispatcher == null
		) {
			return message.reply("There is no song playing right now!");
		}
		if (!message.guild.musicData.queue) return message.say("There are no songs in queue");
		message.guild.musicData.songDispatcher.end();
		message.guild.musicData.queue.length = 0; // clear queue
		return;
	}
};
