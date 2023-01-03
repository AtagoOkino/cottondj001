const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("skipto").setDescription("Skip đến bài hát số #")
    .addNumberOption((option) => 
        option.setName("tracknumber").setDescription("Số thứ tự để skip đến").setMinValue(1).setRequired(true)),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng chờ.")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("Số thứ tự bài hát không hợp lệ.")
		queue.skipTo(trackNum - 1)

        await interaction.editReply(`Đã skip đến bài hát số ${trackNum}`)
	},
}