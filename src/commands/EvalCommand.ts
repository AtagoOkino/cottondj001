/* eslint-disable no-eval */
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";
import { inspect } from "util";

@DefineCommand({
    aliases: ["evaluate", "ev", "js-exec"],
    cooldown: 0,
    description: "Đánh giá",
    name: "eval",
    usage: "{prefix}eval <code gì đấy>"
})
export class EvalCommand extends BaseCommand {
    public async execute(message: Message, args: string[]): Promise<any> {
        const msg = message;
        const client = this.client;

        if (!client.config.owners.includes(msg.author.id)) {
            return message.channel.send(createEmbed("error", "Lệnh này được giới hạn bởi Okino."));
        }

        const embed = createEmbed("info")
            .addField("Input", `\`\`\`js\n${args.join(" ")}\`\`\``);

        try {
            const code = args.slice(0).join(" ");
            if (!code) return message.channel.send(createEmbed("error", "Không có code nào được cung cấp."));
            let evaled = await eval(code);

            if (typeof evaled !== "string") {
                evaled = inspect(evaled, {
                    depth: 0
                });
            }

            const output = this.clean(evaled);
            if (output.length > 1024) {
                const hastebin = await client.util.hastebin(output);
                embed.addField("Output", `${hastebin}.js`);
            } else { embed.addField("Output", `\`\`\`js\n${output}\`\`\``); }
            void message.channel.send(embed);
        } catch (e) {
            const error = this.clean(String(e));
            if (error.length > 1024) {
                const hastebin = await client.util.hastebin(error);
                embed.addField("Error", `${hastebin}.js`);
            } else { embed.setColor("RED").addField("Error", `\`\`\`js\n${error}\`\`\``); }
            message.channel.send(embed).catch(e => client.logger.error("EVAL_CMD_MSG_ERR:", e));
            client.logger.error("EVAL_CMD_ERR:", e);
        }

        return message;
    }

    private clean(text: string): string {
        if (typeof text === "string") {
            return text
                .replace(new RegExp(process.env.SECRET_DISCORD_TOKEN!, "g"), "[REDACTED]")
                .replace(new RegExp(process.env.SECRET_YT_API_KEY!, "g"), "[REDACTED]")
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`);
        } return text;
    }
}
