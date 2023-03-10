import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { disableInviteCmd } from "../config";
import { Message } from "discord.js";

@DefineCommand({
    description: "Gửi link mời bot",
    disable: disableInviteCmd,
    usage: "{prefix}invite",
    name: "invite"
})
export class InviteCommand extends BaseCommand {
    public async execute(message: Message): Promise<void> {
        message.channel.send(
            createEmbed("info")
                .addField("Invite Link", `**[Click vào đây](${await this.client.generateInvite({ permissions: 53857345 })})** để thêm bot vào server của bạn.`)
        ).catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
    }
}
