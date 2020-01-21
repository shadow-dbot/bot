const { Command } = require("discord.js-commando");

module.exports = class pauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: "pause",
			aliases: ["pause-song", "hold", "stop"],
			memberName: "pause",
			group: "music",
			description: "Pauses the current song",
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
			return message.say("There is no song playing right now!");
		}

		message.say("Song paused :pause_button:");

		message.guild.musicData.songDispatcher.pause();
	}
};
