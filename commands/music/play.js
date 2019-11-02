const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { youtubeAPI } = require("../../config/key.js");
const Youtube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new Youtube(youtubeAPI);

module.exports = class playCommand extends Command {
	constructor(client) {
		super(client, {
			name: "play",
			aliases: ["p", "play-song", "add"],
			memberName: "play",
			group: "music",
			description: "Play any song or playlist from youtube",
			guildOnly: true,
			clientPermissions: ["SPEAK", "CONNECT"],
			throttling: {
				usages: 2,
				duration: 5,
			},
			args: [
				{
					key: "query",
					prompt: "What song or playlist would you like to listen to?",
					type: "string",
					validate: query => query.length > 0 && query.length < 200,
				},
			],
		});
	}

	async run(message, { query }) {
		var voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.say("Join a channel and try again");

		if (query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
			try {
				const playlist = await youtube.getPlaylist(query);
				const videosObj = await playlist.getVideos(25); // remove the 10 if you removed the queue limit conditions below

				for (let i = 0; i < videosObj.length; i++) {
					const video = await videosObj[i].fetch();

					const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
					const title = video.raw.snippet.title;
					const thumbnail = video.thumbnails.high.url;

					let duration = this.formatDuration(video.duration);
					if (duration == "00:00") duration = "Live Stream";

					const song = {
						url,
						title,
						duration,
						thumbnail,
						voiceChannel,
					};
					message.guild.musicData.queue.push(song);
				}

				if (message.guild.musicData.isPlaying == false) {
					message.guild.musicData.isPlaying = true;
					return this.playSong(message.guild.musicData.queue, message);
				} else if (message.guild.musicData.isPlaying == true) {
					return message.say(
						`Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
					);
				}
			} catch (err) {
				console.error(err);
				return message.say("Playlist is either private or it does not exist");
			}
		}

		// This if statement checks if the user entered a youtube url, it can be any kind of youtube url
		if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
			const url = query;
			try {
				query = query.replace(/(>|<)/gi, "").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

				const id = query[2].split(/[^0-9a-z_\-]/i)[0];
				const video = await youtube.getVideoByID(id);

				const title = video.title;
				const thumbnail = video.thumbnails.high.url;

				let duration = this.formatDuration(video.duration);
				if (duration == "00:00") duration = "Live Stream";

				const song = {
					url,
					title,
					duration,
					thumbnail,
					voiceChannel,
				};

				message.guild.musicData.queue.push(song);

				if (
					message.guild.musicData.isPlaying == false ||
					typeof message.guild.musicData.isPlaying == "undefined"
				) {
					message.guild.musicData.isPlaying = true;
					return this.playSong(message.guild.musicData.queue, message);
				} else if (message.guild.musicData.isPlaying == true) {
					return message.say(`${song.title} added to queue`);
				}
			} catch (err) {
				console.error(err);
				return message.say("Something went wrong, please try later");
			}
		}

		try {
			const videos = await youtube.searchVideos(query, 5);

			if (videos.length < 5) {
				return message.say(
					`I had some trouble finding what you were looking for, please try again or be more specific`
				);
			}

			const vidNameArr = [];

			for (let i = 0; i < videos.length; i++) {
				vidNameArr.push(`${i + 1}: ${videos[i].title}`);
			}

			vidNameArr.push("exit");

			const embed = new MessageEmbed()
				.setColor("#e9f931")
				.setTitle("Choose a song by commenting a number between 1 and 5")
				.addField("Song 1", vidNameArr[0])
				.addField("Song 2", vidNameArr[1])
				.addField("Song 3", vidNameArr[2])
				.addField("Song 4", vidNameArr[3])
				.addField("Song 5", vidNameArr[4])
				.addField("Exit", "exit");

			var songEmbed = await message.say({ embed });

			var response = await message.channel.awaitMessages(
				msg => (msg.content > 0 && msg.content < 6) || msg.content === "exit",
				{
					max: 1,
					maxProcessed: 1,
					time: 60000,
					errors: ["time"],
				}
			);

			if (!response.first()) {
				songEmbed.delete();
				return message.say("Please try again and enter a number between 1 and 5 or exit");
			}

			var videoIndex = parseInt(response.first().content);
			if (response.first().content === "exit") return songEmbed.delete();

			try {
				var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
			} catch (err) {
				console.error(err);
				songEmbed.delete();
				return message.say(
					"An error has occured when trying to get the video ID from youtube"
				);
			}

			const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
			const title = video.title;
			const thumbnail = video.thumbnails.high.url;

			let duration = this.formatDuration(video.duration);
			if (duration == "00:00") duration = "Live Stream";

			const song = {
				url,
				title,
				duration,
				thumbnail,
				voiceChannel,
			};

			message.guild.musicData.queue.push(song);

			if (message.guild.musicData.isPlaying == false) {
				message.guild.musicData.isPlaying = true;
				songEmbed.delete();
				this.playSong(message.guild.musicData.queue, message);
			} else if (message.guild.musicData.isPlaying == true) {
				songEmbed.delete();
				return message.say(`${song.title} added to queue`);
			}
		} catch (err) {
			console.error(err);
			if (songEmbed) {
				songEmbed.delete();
			}
			return message.say("Something went wrong with searching the video you requested :(");
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
						console.error(e);
						message.say("Cannot play song");

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
