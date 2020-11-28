const config = require("../config.js");
const version = config.version;
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "changelogs",
  description: "Shows bot changelogs",
  aliases: ["whats-new", "change-logs", "changelog"],
  cooldown: 5,
  disableable: false,
  execute: message => {
    const client = message.client;
    const changelog = new MessageEmbed()
      .setAuthor("About " + client.user.username, client.user.displayAvatarURL())
      .setColor("RANDOM")
      .setDescription("v" + version)
      .addField("📜 Changelog", "No information provided.")
    message.channel.send(changelog);
  }
};
