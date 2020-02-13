const { Command } = require("discord.js-commando");

module.exports = class againCommand extends Command {
	constructor(client) {
		super(client, {
			name: "again",
			group: "music",
			memberName: "again",
			guildOnly: true,
			description: "Plays the current song again",
		});
	}

	run(message) {
		if (!message.guild.musicData.isPlaying) {
			return message.say("There is no song playing right now!");
		}

		message.channel.send(`${message.guild.musicData.nowPlaying.title} added to the queue`);
		message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
		return;
	}
};
