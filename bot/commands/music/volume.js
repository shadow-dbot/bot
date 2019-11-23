const { Command } = require("discord.js-commando");

module.exports = class volumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "volume",
			aliases: ["change-volume"],
			group: "music",
			memberName: "volume",
			guildOnly: true,
			description: "Adjust song volume",
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: "wantedVolume",
					prompt: "What volume would you like to set? from 1 to 100",
					type: "integer",
					validate: wantedVolume => wantedVolume >= 1 && wantedVolume <= 100,
				},
			],
		});
	}

	run(message, { wantedVolume }) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.reply("Join a channel and try again");

		if (
			typeof message.guild.musicData.songDispatcher == "undefined" ||
			message.guild.musicData.songDispatcher == null
		) {
			return message.reply("There is no song playing right now!");
		}
		const volume = wantedVolume;
		message.guild.musicData.songDispatcher.setVolume(volume);
	}
};
