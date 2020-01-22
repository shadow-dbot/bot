const { Command } = require("discord.js-commando");

module.exports = class leaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: "leave",
			aliases: ["end"],
			group: "music",
			memberName: "leave",
			guildOnly: true,
			description: "Leaves the voice channel",
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
		message.guild.musicData.queue.length = 0;
		return;
	}
};
