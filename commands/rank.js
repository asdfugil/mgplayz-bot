const Keyv = require("keyv");
const {
  Rank,
  findMember,
  deserialize
} = require("../modules/botModule.js");
const fetch = require("node-fetch");
require("dotenv").config();
const serialize = require("serialize-javascript");
const fs = require("fs");
const ranks = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "ranks"
});
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "rank",
  description: "Shows your rank",
  aliases: ["level"],
  cooldown: 5.2,
  execute: async (message, args) => {
    const x = message.client.emojis.cache.find(emoji => emoji.name === "Error");
    let member
    if (args[0]) member = await findMember(message,args.join(" ")).catch(error => message.reply("That's not a valid member!"))
    else member = message.member
    if (!member.roles.add) return
    const guildRanks =
      (await ranks.get(message.guild.id)) || Object.create(null);
    if (await guildRanks[member.id]) {
      const rank = new Rank(guildRanks[member.id]);
      const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setDescription(`Level ${rank.getLevel()} (${rank.getLevelXP()})`)
      .addField(`Total `, Math.round(rank.xp).toLocaleString("en-US"))
      .setTimestamp();
      message.channel.send(embed)
    } else {
      message.channel.send(x + " **That user isn't ranked yet, or is a bot.**")
    }
  }
}