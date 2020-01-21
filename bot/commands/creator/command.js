const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const DB = require("../../../database");

module.exports = class command extends Command {
	constructor(client) {
		super(client, {
			name: "command",
			group: "creator",
			memberName: "command",
			description: "Get amount of commands issued in server",
		});
	}

	async run(msg) {
		try {
			const _guild = await DB.Guilds.findOne({ guildID: msg.guild.id }).catch(e => {
				console.log(e);
			});

			const amount = await DB.Command.find({ guild: _guild })
				.countDocuments()
				.lean();

			msg.reply(`So far there has been ${amount} used in this guild`);
		} catch (e) {
			console.log(e);
			msg.reply("An error has occured, please try again later.");
		}
	}
};
