const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const moment = require("moment");

module.exports = class userInfo extends Command {
	constructor(client) {
		super(client, {
			name: "userinfo",
			group: "info",
			memberName: "userinfo",
			guildOnly: true,
			description: "Returns Users Information",
			examples: ["serverstats"],
			// userPermissions: [''],
		});
	}

	async run(msg) {
		try {
			let embed = new Discord.RichEmbed()
				.setTitle("USer info")
				.setColor("ff0000")
				.setThumbnail(serverIcon)
				.addField(
					"Created on",
					moment(msg.guild.createdAt).format("MMMM Do YYYY, h:mm:ss a")
				)
				.addField(
					"You joined on",
					moment(msg.member.joinedAt).format("MMMM Do YYYY, h:mm:ss a")
				)
				.addField("Total Members", msg.guild.memberCount, true)
				.addField("Amount of bots", botAmount, true)
				.addField("Amount of users", UserAmount, true);

			msg.channel.send(embed);
		} catch (e) {
			console.log(e);
			msg.reply("An error has occured, please try again later.");
		}
	}
};
