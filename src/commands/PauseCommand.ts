import { isUserInTheVoiceChannel, isMusicQueueExists, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";

@DefineCommand({
    description: "Dừng phát nhạc",
    name: "pause",
    usage: "{prefix}pause"
})
export class PauseCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicQueueExists()
    @isSameVoiceChannel()
    public execute(message: Message): any {
        if (message.guild?.queue?.playing) {
            message.guild.queue.playing = false;
            message.guild.queue.connection?.dispatcher.pause();
            return message.channel.send(createEmbed("info", "⏸ **|** Đã tạm dừng trình chơi nhạc."));
        }
        message.channel.send(createEmbed("warn", "Đã tạm dừng trình chơi nhạc."))
            .catch(e => this.client.logger.error("PAUSE_CMD_ERR:", e));
    }
}
