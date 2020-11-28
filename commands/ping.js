const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "ping",
  description: "returns latency",
  aliases: ["pong"],
  cooldown: 2,
  disableable: false,
  execute: message => {
    const client = message.client;
    const pinging = new MessageEmbed()
      .setDescription(`Pinging...`)
      .setTimestamp()
    message.channel.send(pinging).then(async m => {
      const embed = new MessageEmbed()
        .setTitle(`:ping_pong: Pong!`)
        .setColor("RANDOM")
        .addField(
          "Message Round Trip",
          `${Math.abs(m.createdTimestamp - message.createdTimestamp)} ms`
        )
        .addField("Discord Heartbeat", `${Math.round(client.ws.ping)} ms`)
        .setTimestamp()
     await m.edit(embed);
    });
  }
};
