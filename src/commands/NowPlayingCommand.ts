import { isMusicQueueExists } from "../utils/decorators/MusicHelper";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";

@DefineCommand({
    aliases: ["np", "now-playing"],
    description: "Thông tin về nhạc đang được phát",
    name: "nowplaying",
    usage: "{prefix}nowplaying"
})
export class NowPlayingCommand extends BaseCommand {
    @isMusicQueueExists()
    public execute(message: Message): any {
        const song = message.guild?.queue?.songs.first();
        return message.channel.send(
            createEmbed("info", `${message.guild?.queue?.playing ? "▶ **|** Đang phát:" : "⏸ **|** Đang phát:"} ` +
                `**[${song?.title as string}](${song?.url as string})**`)
                .setThumbnail(song?.thumbnail as string)
        );
    }
}
