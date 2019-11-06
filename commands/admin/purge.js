const { Command } = require("discord.js-commando");

module.exports = class purgeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "purge",
			group: "admin",
			memberName: "purge",
			guildOnly: true,
			description: "Deletes X amount of messages",
			throttling: {
				usages: 2,
				duration: 1500,
			},
			examples: ["purge 1-100 purges x amount of messages"],
			userPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					key: "amount",
					prompt: "Please provide the amount of messages you want deleted, 1-100.",
					type: "string",
				},
			],
		});
	}

	async run(msg, { amount }) {
		if (amount > 100) {
			msg.reply("Amount cannot be greater than a 100, Purging 100 msgs.");
			amount = 100;
		}

		amount = parseInt(amount);
		try {
			msg.channel
				.bulkDelete(amount)
				.then(_ => {
					msg.channel
						.send(`Deleted ${amount} messages.`)
						.then(m => m.delete(2500))
						.catch(e => console.error(e));
				})
				.catch(err => {
					console.log(err);
					msg.channel.send(err.message);
				});
		} catch (e) {
			console.log(e);
			return msg.reply("An Error occured, Please try again later.");
		}
	}
};
