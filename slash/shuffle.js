const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Trộn các bài hát trong hàng chờ."),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng chờ")

		queue.shuffle()
        await interaction.editReply(`Hàng chờ đã được trộn!`)
	},
}