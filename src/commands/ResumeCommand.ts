import { isUserInTheVoiceChannel, isMusicQueueExists, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";
import { satisfies } from "semver";

@DefineCommand({
    description: "Tiếp tục phát nhạc",
    name: "resume",
    usage: "{prefix}resume"
})
export class ResumeCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicQueueExists()
    @isSameVoiceChannel()
    public execute(message: Message): any {
        if (message.guild?.queue?.playing) {
            message.channel.send(createEmbed("warn", "Vẫn đang phát nhạc.")).catch(e => this.client.logger.error("RESUME_CMD_ERR:", e));
        } else {
            message.guild!.queue!.playing = true;
            message.guild?.queue?.connection?.dispatcher.resume();
            if (satisfies(process.version, ">=14.17.0")) {
                message.guild?.queue?.connection?.dispatcher.pause();
                message.guild?.queue?.connection?.dispatcher.resume();
            }
            message.channel.send(createEmbed("info", "▶ **|** Đã tiếp tục phát nhạc.")).catch(e => this.client.logger.error("RESUME_CMD_ERR:", e));
        }
    }
}
