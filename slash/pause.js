const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Tạm dừng chơi nhạc."),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng chờ.")

		queue.setPaused(true)
        await interaction.editReply("Nhạc đã được tạm dừng, vui lòng sử dụng `/resume` để tiếp tục chơi nhạc.")
	},
}