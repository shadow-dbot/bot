const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");

module.exports = class info extends Command {
	constructor(client) {
		super(client, {
			name: "info",
			group: "info",
			aliases: ["information", "creator"],
			memberName: "information",
			guildOnly: false,
			description: "Send info about the bot and it's creator",
		});
	}

	async run(msg) {
		try {
			console.log(this.client.users.size);
			let minutes = parseInt((this.client.uptime / (1000 * 60)) % 60),
				hours = parseInt((this.client.uptime / (1000 * 60 * 60)) % 24);

			hours = hours < 10 ? "0" + hours : hours;
			minutes = minutes < 10 ? "0" + minutes : minutes;

			let guilds = this.client.guilds.array();
			let users = [];

			for (var i = 0; i < guilds.length; i++) {
				let members = guilds[i].members.array();

				for (var i = 0; i < members.length; i++) {
					if (
						members[i].user.id !== this.client.user.id &&
						users.indexOf(members[i].user.id) === -1
					)
						users.push(members[i].user.id);
				}
			}

			console.log(users.length);

			let embed = new MessageEmbed()
				// .setTitle("Server information")
				.setColor("ff0000")
				.setTitle("Information about me ")
				.setTimestamp()
				.addField("I'm currently in ", `${this.client.guilds.size} servers`, false)
				.addField(`With a total of `, `${users.length} users`, false)
				// .addField(with a total of , this.client.guilds.size)
				.addField(
					`:chart_with_upwards_trend: `,
					`I've been running for **${hours}** hours, **${minutes}** minutes!`,
					false
				)
				.setDescription(`Created by [Demian](https://demiann.xyz)`);

			msg.channel.send(embed);
		} catch (e) {
			console.log(e);
			msg.reply("An error has occured, please try again later.");
		}
	}
};
