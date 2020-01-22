const { Structures } = require("discord.js");

const musicStructure = client => {
	Structures.extend("Guild", Guild => {
		class MusicGuild extends Guild {
			constructor(client, data) {
				super(client, data);
				this.musicData = {
					queue: [],
					isPlaying: false,
					nowPlaying: null,
					songDispatcher: null,
				};
			}
		}
		return MusicGuild;
	});
};

module.exports = client => musicStructure(client);
