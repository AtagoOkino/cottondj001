import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";

@DefineCommand({
    aliases: ["h", "command", "commands", "cmd", "cmds"],
    description: "Show các lệnh",
    name: "help",
    usage: "{prefix}help [lệnh]"
})
export class HelpCommand extends BaseCommand {
    public execute(message: Message, args: string[]): void {
        const command = message.client.commands.get(args[0]) ??
            message.client.commands.get(message.client.commands.aliases.get(args[0])!);
        if (command && !command.meta.disable) {
            message.channel.send(
                createEmbed("info")
                    .setAuthor(`Information for the ${command.meta.name} command`)
                    .setThumbnail("https://raw.githubusercontent.com/zhycorp/disc-11/main/.github/images/question_mark.png")
                    .addFields({ name: "Name", value: `\`${command.meta.name}\``, inline: false },
                        { name: "Description", value: command.meta.description, inline: true },
                        { name: "Aliases", value: `${Number(command.meta.aliases?.length) > 0 ? command.meta.aliases?.map(c => `**\`${c}\`**`).join(", ") as string : "None."}`, inline: false },
                        { name: "Usage", value: `**\`${command.meta.usage?.replace(/{prefix}/g, message.client.config.prefix) as string}\`**`, inline: true })
            ).catch(e => this.client.logger.error("HELP_CMD_ERR:", e));
        } else {
            message.channel.send(
                createEmbed("info", message.client.commands.filter(cmd => !cmd.meta.disable && cmd.meta.name !== "eval").map(c => `\`${c.meta.name}\``).join(" "))
                    .setAuthor(`${message.client.user!.username} - Danh sách lệnh`)
                    .setThumbnail(message.client.user?.displayAvatarURL() as string)
                    .setFooter(`Ghi ${message.client.config.prefix}help <tên lệnh> để biết thêm thông tin chi tiết.`, "https://raw.githubusercontent.com/zhycorp/disc-11/main/.github/images/info.png")
            ).catch(e => this.client.logger.error("HELP_CMD_ERR:", e));
        }
    }
}