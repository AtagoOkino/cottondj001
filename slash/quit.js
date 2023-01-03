const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("quit").setDescription("Dừng bot và xoá hàng chờ."),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng chờ.")

		queue.destroy()
        await interaction.editReply("Tạm biệt!")
	},
}