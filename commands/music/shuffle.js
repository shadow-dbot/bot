const { Command } = require("discord.js-commando");

module.exports = class ShuffleQueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: "shuffle",
			memberName: "shuffle",
			group: "music",
			description: "Shuffle the song queue",
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

		if (message.guild.musicData.queue.length < 1)
			return message.say("There are no songs in queue");

		shuffleQueue(message.guild.musicData.queue);

		return message.say("Queue shuffled, to view new queue, call queue command");
	}
};

function shuffleQueue(queue) {
	for (let i = queue.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[queue[i], queue[j]] = [queue[j], queue[i]];
	}
}
