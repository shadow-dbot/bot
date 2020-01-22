const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = class avatar extends Command {
	constructor(client) {
		super(client, {
			name: "avatar",
			group: "info",
			aliases: ["icon"],
			memberName: "avatar",
			guildOnly: true,
			description: "Sends either your Avatar or the tagged user's",
			examples: ["avatar"],
		});
	}

	async run(msg) {
		try {
			// let avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
			let user = msg.mentions.users.first() || msg.author;
			let embed = new MessageEmbed()
				.setImage(user.avatarURL())
				.setDescription(`[Direct Link](${user.avatarURL()})`);

			msg.channel.send(embed);
		} catch (e) {
			console.log(e);
			msg.reply("An error has occured, please try again later.");
		}
	}
};
