const fetch = require("node-fetch");
const { Command } = require("discord.js-commando");

const validUrl = require("valid-url");
const shortid = require("shortid");

const DB = require("./../../database");

module.exports = class shortenCommand extends Command {
	constructor(client) {
		super(client, {
			name: "shorten",
			aliases: ["short", "url"],
			group: "misc",
			memberName: "shorten",
			description: "Shortens url",
			throttling: {
				usages: 2,
				duration: 10,
			},
			args: [
				{
					key: "longUrl",
					prompt: "Please provide the url you want shorter",
					type: "string",
					validate: longUrl => longUrl.length > 5,
				},
			],
		});
	}

	async run(msg, { longUrl }) {
		const baseUrl = "https://demiann.xyz";

		if (!validUrl.isUri(baseUrl)) {
			return msg.reply("Invalid base url");
		}
		const urlCode = shortid.generate();

		if (validUrl.isUri(longUrl)) {
			let url = await DB.Url.findOne({
				longUrl,
			});

			if (url) {
				return msg.reply(url.shortUrl);
			}

			const shortUrl = `${baseUrl}/${urlCode}`;

			url = new DB.Url({
				longUrl,
				shortUrl,
				urlCode,
				date: new Date(),
			});
			await url.save();

			return msg.reply(url.shortUrl);
		}
		msg.reply("Url is not valid");
	}
};
