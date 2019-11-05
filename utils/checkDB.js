const db = require("./../models/");

module.exports = {
	guild: async (client, guild) => {
		let foundGuild = await db.Guilds.findOne({ guildID: guild.id });
		let settings = await db.Settings.findOne({ guildID: guild.id });

		if (foundGuild && settings) return;

		settings = new db.Settings({ guildID: guild.id });
		settings.save();

		const newServer = new db.Guilds({
			guildID: guild.id,
			ownerID: guild.ownerID,
			region: guild.region,
			name: guild.name,
			icon: guild.icon,
			settings: settings._id,
		});

		await newServer.save();
	},
};
