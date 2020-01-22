const { Command } = require("discord.js-commando");

module.exports = class volumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "volume",
			aliases: ["change-volume"],
			group: "music",
			memberName: "volume",
			guildOnly: true,
			description: "Change the music volume",
			throttling: {
				usages: 1,
				duration: 1,
			},
			args: [
				{
					key: "wantedVolume",
					prompt: "What volume would you like to set? from 0 to 2.0",
					type: "float",
					validate: wantedVolume => wantedVolume >= 0 && wantedVolume <= 2,
				},
			],
		});
	}

	run(message, { wantedVolume }) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.reply("Join a channel and try again");

		if (
			typeof message.guild.musicData.songDispatcher == "undefined" ||
			message.guild.musicData.songDispatcher == null ||
			!message.guild.musicData.isPlaying ||
			message.guild.musicData.nowPlaying == null
		) {
			return message.reply("There is no song playing right now!");
		}
		const volume = wantedVolume;
		message.guild.musicData.songDispatcher.setVolume(volume);
	}
};
