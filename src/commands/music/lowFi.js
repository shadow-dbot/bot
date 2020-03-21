const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const Youtube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new Youtube(process.env.YOUTUBE_API);

module.exports = class lowFiCommand extends Command {
	constructor(client) {
		super(client, {
			name: "lowfi",
			aliases: ["low", "fi", "chill", "study", "1am"],
			memberName: "lowfi",
			group: "music",
			description: "Plays a LowFi Stream",
			guildOnly: true,
			clientPermissions: ["SPEAK", "CONNECT"],
			throttling: {
				usages: 2,
				duration: 5,
			},
		});
	}

	async run(message) {
		// initial checking
		let voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.say("Join a channel and try again");

		let query = "https://www.youtube.com/watch?v=5qap5aO4i9A";
		try {
			query = query.replace(/(>|<)/gi, "").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
			const id = query[2].split(/[^0-9a-z_\-]/i)[0];
			const video = await youtube.getVideoByID(id);
			const title = video.title;
			const url = `https://www.youtube.com/watch?v=${video.raw.id}`;

			let duration = this.formatDuration(video.duration);
			const thumbnail = video.thumbnails.high.url;
			if (duration == "00:00") duration = "Live Stream";
			const song = {
				url,
				title,
				duration,
				thumbnail,
				voiceChannel,
			};
			//reset
			if (message.guild.musicData.isPlaying == true) {
				message.guild.musicData.queue = [];
				message.guild.musicData.isPlaying = false;
			}

			message.guild.musicData.queue.push(song);
			message.guild.musicData.isPlaying = true;
			return this.playSong(message.guild.musicData.queue, message);
		} catch (err) {
			console.error(err);
			return message.say("Something went wrong, please try later");
		}
	}
	playSong(queue, message) {
		queue[0].voiceChannel
			.join()
			.then(connection => {
				const dispatcher = connection
					.play(
						ytdl(queue[0].url, {
							quality: "highestaudio",
							highWaterMark: 1024 * 1024 * 10,
						})
					)
					.on("start", () => {
						message.guild.musicData.songDispatcher = dispatcher;
						const videoEmbed = new MessageEmbed()
							.setThumbnail(queue[0].thumbnail)
							.setColor("#e9f931")
							.addField("Now Playing:", queue[0].title)
							.addField("Duration:", queue[0].duration);
						if (queue[1]) videoEmbed.addField("Next Song:", queue[1].title);
						message.say(videoEmbed);
						message.guild.musicData.nowPlaying = queue[0];
						return queue.shift();
					})
					.on("finish", () => {
						if (queue.length >= 1) {
							return this.playSong(queue, message);
						} else {
							message.guild.musicData.isPlaying = false;
							message.guild.musicData.nowPlaying = null;
							return message.guild.me.voice.channel.leave();
						}
					})
					.on("error", e => {
						message.say("Cannot play song");
						console.error(e);
						return message.guild.me.voice.channel.leave();
					});
			})
			.catch(e => {
				console.error(e);
				return message.guild.me.voice.channel.leave();
			});
	}

	formatDuration(durationObj) {
		const duration = `${durationObj.hours ? durationObj.hours + ":" : ""}${
			durationObj.minutes ? durationObj.minutes : "00"
		}:${
			durationObj.seconds < 10
				? "0" + durationObj.seconds
				: durationObj.seconds
				? durationObj.seconds
				: "00"
		}`;
		return duration;
	}
};
