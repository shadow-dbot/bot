const event = require("../events/");

const events = client => {
	client.on("ready", () => {
		console.log("Ready");
		client.user.setActivity(
			`${client.commandPrefix}help || Serving ${client.guilds.size} servers and ${client.users.size} users`
		);
	});

	client.on("message", async msg => {
		await event.message.index(client, msg.guild, msg);
	});

	/* Guild Events*/
	client.on("guildCreate", async guild => {
		await event.guild.create(client, guild);
	});

	client.on("guildDelete", async guild => {
		await event.guild.delete(client, guild);
	});

	client.on("guildMemberAdd", async member => {
		await event.guild.memberAdd(client, member.guild, member);
	});

	client.on("guildUnavailable", async guild => {
		await event.guild.unAvailable(client, guild);
	});

	// client.on("guildBanAdd", async (guild, user) => {
	// 	await event.guild.banAdd(client, guild, user);
	// });

	client.on("commandError", async (cmd, error, cmdMessage, query) => {
		await event.command.error(client, cmdMessage.channel.guild, cmd, error, cmdMessage, query);
	});

	client.on("commandRun", async cmd => {
		await event.command.stats(client, cmd);
	});
};

module.exports = client => events(client);
