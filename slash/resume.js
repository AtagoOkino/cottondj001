const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Tiếp tục chơi nhạc"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng chờ.")

		queue.setPaused(false)
        await interaction.editReply("Nhạc đã dừng, vui lòng sử dụng `/pause` để tiếp tục chơi nhạc")
	},
}