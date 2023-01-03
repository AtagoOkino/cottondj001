const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Load các bài hát từ YouTube.")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Load một bài hát từ url.")
				.addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Load một playlist từ url.")
				.addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Tìm kiếm bài hát dựa trên từ khoá.")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("the search keywords").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("Bạn phải ở trong Voice Chat để sử dụng lệnh này.")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new MessageEmbed()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Không có kết quả.")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`✅ **|** Track **[${song.title}](${song.url})** đã được thêm vào hàng chờ.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Thời lượng: ${song.duration}`})

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Không có kết quả.")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`Thêm tất cả các track có trong playlist: **[${playlist.title}](${playlist.url})**, vui lòng đợi...`)
                .setThumbnail(playlist.thumbnail)
		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Không có kết quả.")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`✅ **|** Track **[${song.title}](${song.url})** đã được thêm vào hàng chờ.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Thời lượng: ${song.duration}`})
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}