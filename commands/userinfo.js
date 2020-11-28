const { findUser } = require("../modules/botModule.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
module.exports = {
  name: "userinfo",
  aliases:["whois","user-info"],
  description: "Shows user information. (Not a member)",
  usage:"[user resolvable]",
  cooldown:2,
  execute: async (message, args) => {
    const client = message.client;
    const online = client.emojis.cache.find(emoji => emoji.name === "online");
    const idle = client.emojis.cache.find(emoji => emoji.name === "idle");
    const dnd = client.emojis.cache.find(emoji => emoji.name === "dnd");
    const offline = client.emojis.cache.find(emoji => emoji.name === "offline");
    const x = client.emojis.cache.find(emoji => emoji.name === "Error");
    let user 
    if (!args[0]) user = message.author
    else user = await findUser(message,args.join(" "))
    .catch(error => {
      if (error.code === 10013) return message.channel.send(`${x} **Cannot find the user you're looking for.**`)
      else throw error
    })
    if (!user || !user.id) return
    const embed = new MessageEmbed()
    .setTitle(":bust_in_silhouette:  User Information")
    .setDescription(user)
    .setThumbnail(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .addField("Registered", moment.utc(user.createdAt).format('ddd, DD MMM YYYY LT'), true)
    try {
        if (user.presence.status === "online") user.presence.status = `${online} Online`;
        if (user.presence.status === "idle") user.presence.status = `${idle} Idle`;
        if (user.presence.status === "dnd") user.presence.status = `${dnd} Do Not Disturb`;
        if (user.presence.status === "offline") user.presence.status = `${offline} Offline`;
        embed.addField("Status", user.presence.status, true);
      if (user.presence.game) {
        if (user.presence.game.name == "Custom Status")
          user.presence.game.name = "Custom Status - " + user.presence.game.state;
        embed.addField("Playing", user.presence.game.name, true);
      }
    } catch (error) {}
    message.channel.send(embed);
  }
};
