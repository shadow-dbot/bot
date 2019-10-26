const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "avatar",
			group: "info",
			memberName: "avatar",
			guildOnly: true,
			description: "Returns user avatar url",
			examples: ["avatar"],
		});
	}

	async run(msg) {
		try {
			let user = msg.mentions.users.first() || msg.author;
			let embed = new Discord.RichEmbed()
				.setImage(user.avatarURL)
				.setDescription(`[Direct Link](${user.avatarURL})`);
			msg.channel.send(embed);
		} catch (e) {
			console.log(e);
			msg.reply("An error has occured, please try again later.");
		}
	}
};
