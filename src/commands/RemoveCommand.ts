import { isMusicQueueExists, isSameVoiceChannel, isUserInTheVoiceChannel } from "../utils/decorators/MusicHelper";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";

@DefineCommand({
    aliases: ["rm", "delete", "del"],
    description: "Xóa track khỏi hàng chờ",
    name: "remove",
    usage: "{prefix}remove <số thứ tự của track trong hàng chờ>"
})
export class RemoveCommand extends BaseCommand {
    @isMusicQueueExists()
    @isUserInTheVoiceChannel()
    @isSameVoiceChannel()
    public execute(message: Message, args: string[]): any {
        if (isNaN(Number(args[0]))) return message.channel.send(createEmbed("error", `Lỗi, vui lòng dùng **\`${this.client.config.prefix}help ${this.meta.name}\`** để biết thêm thông tin chi tiết.`));

        const songs = message.guild!.queue!.songs.map(s => s);
        const currentSong = message.guild!.queue!.songs.first()!;
        const song = songs[Number(args[0]) - 1];

        if (currentSong.id === song.id) {
            message.guild!.queue!.playing = true;
            message.guild?.queue?.connection?.dispatcher.once("speaking", () => message.guild?.queue?.connection?.dispatcher.end());
            message.guild!.queue?.connection?.dispatcher.resume();
        } else {
            message.guild?.queue?.songs.delete(message.guild.queue.songs.findKey(x => x.id === song.id)!);
        }

        message.channel.send(
            createEmbed("info", `✅ **|** Đã xóa **[${song.title}](${song.url}})**`)
                .setThumbnail(song.thumbnail)
        ).catch(e => this.client.logger.error("REMOVE_COMMAND_ERR:", e));
    }
}
