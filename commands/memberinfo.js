const {
  findUser,
  findMember,
  getJoinRank
} = require("../modules/botModule.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
module.exports = {
  name: "memberinfo",
  aliases: ["member-info"],
  description: "Shows information of a server member.",
  usage: "[username/id]",
  cooldown: 2,
  execute: async (message, args) => {
    const client = message.client;
    const online = client.emojis.cache.find(emoji => emoji.name === "online");
    const idle = client.emojis.cache.find(emoji => emoji.name === "idle");
    const dnd = client.emojis.cache.find(emoji => emoji.name === "dnd");
    const offline = client.emojis.cache.find(emoji => emoji.name === "offline");
    const x = client.emojis.cache.find(emoji => emoji.name === "Error");
    let member;
    if (args[0]) {
      member = await findMember(message, args.join(" ")).catch(error => {
        member = message.member;
      });
    } else member = message.member;
    const embed = new MessageEmbed()
      .setTitle(":busts_in_silhouette:  Member Information")
      .setColor(member.displayHexColor)
      .setDescription(member)
      .addField(
        "Registered",
        moment.utc(member.user.createdAt).format("ddd, DD MMM YYYY LT"),
        true
      ) //.toLocaleString("en-US", {timeZone: "America/New_York"}))
      .addField(
        "Joined",
        moment.utc(member.joinedAt).format("ddd, DD MMM YYYY LT"),
        true
      ); //.toLocaleString("en-US", {timezone: "America/New_York"}))
    if (member.roles.highest)
      embed.addField("Highest Role", member.roles.highest, true);
    if (member.roles.hoist)
      embed.addField("Highest Hoisted Role", member.roles.hoist, true);
    embed.addField("Join Position", getJoinRank(member.id, message), true);
    embed.setThumbnail(
      member.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })
    );
    embed.setColor("RANDOM");
    embed.setTimestamp();
    try {
      if (member.presence.status === "online")
        member.presence.status = `${online} Online`;
      else if (member.presence.status === "idle")
        member.presence.status = `${idle} Idle`;
      else if (member.presence.status === "dnd")
        member.presence.status = `${dnd} Do Not Disturb`;
      else if (member.presence.status === "offline")
        member.presence.status = `${offline} Offline`;
      embed.addField("Status", member.presence.status, true);
      if (member.presence.game) {
        if (member.presence.game.name == "Custom Status")
          member.presence.game.name = member.presence.game.state;
        embed.addField("Playing", member.presence.game.name, true);
      }
    } catch (error) {}
    message.channel.send(embed);
  }
};
