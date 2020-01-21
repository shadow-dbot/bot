const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const moment = require("moment");

const DB = require("../../../database");

module.exports = class serverStats extends Command {
	constructor(client) {
		super(client, {
			name: "serverstats",
			group: "info",
			aliases: ["server"],
			memberName: "serverstats",
			guildOnly: true,
			description:
				"Sends server statistics - Creation date, Join date, Member count, Bot count and User count ",
		});
	}

	async run(msg) {
		try {
			let botAmount = msg.guild.members.filter(member => member.user.bot).size;
			let UserAmount = msg.guild.members.filter(member => !member.user.bot).size;
			let serverIcon = msg.guild.displayAvatarURL;

			const _guild = await DB.Guilds.findOne({ guildID: msg.guild.id }).catch(e => {
				console.log(e);
			});

			const commandsUsed = await DB.Command.find({ guild: _guild })
				.countDocuments()
				.lean();

			let embed = new MessageEmbed()
				// .setTitle("Server information")
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
				.addField(
					"People in this guild have used my commands",
					`${commandsUsed} times`,
					false
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
