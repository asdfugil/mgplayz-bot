require("dotenv").config();
const Keyv = require("keyv");
const config = require("../config.js");
const prefix = config.defaultPrefix;
const prefixs = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "prefixs"
});
const { noPerms } = require("../modules/botModule.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "prefix",
  usage: "<new prefix>",
  guildOnly: true,
  cooldown: 5,
  description: "Sets a new prefix",
  info:
    "Don't set prefixs that begins with a whitespace,otherwise you cannot use the bot anymore.",
  execute: async (message, args) => {
    const client = message.client;
    const check = client.emojis.cache.find(e => e.name === "Check");
    const x = client.emojis.cache.find(f => f.name === "Error");
    const infoblob = client.emojis.cache.find(g => g.name === "infoblob");
    let actualPrefix = prefix;
    if (message.guild) {
      if (await prefixs.get(message.guild.id))
        actualPrefix = await prefixs.get(message.guild.id);
    }
    const infoprefix = new MessageEmbed()
      .setDescription(
        `${infoblob} **Current prefix for this server is \`${actualPrefix}\`**`
      )
      .setColor("RANDOM");
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return noPerms("Manage Server", message.channel);
    if (message.content.slice(actualPrefix.length + 7).startsWith(" "))
      return message.channel.send(
        `${x} **Prefix cannot start with a whitespace!**`
      );
    if (!args.join(" ")) return message.channel.send(infoprefix);
    if (args.join(" ") === null) return;
    if (args.join(" ") === "reset") {
      await prefixs.set(message.guild.id, ":");
      message.channel.send(`${check} **Prefix successfully reset!**`);
    } else {
      await prefixs.set(message.guild.id, args.join(" "));
      message.channel.send(
        `${check} **Prefix set for this guild to \`${args[0]}\`**`
      );
    }
  }
};
