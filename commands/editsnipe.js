const Keyv = require("keyv");
const editsnipe = new Keyv("sqlite://.data/database.sqlite", { namespace: "editsnipe" });//<-- missspelled oof
const { MessageEmbed } = require('discord.js')
module.exports = {
  name:'editsnipe',
  aliases: ["esnipe"],
  description:'View the previous edit of a message',
  async execute(message) {
    const m = await editsnipe.get(message.channel.id)
    if (!m) return message.channel.send("There's nothing to snipe!")
    const embed = new MessageEmbed()
    .setAuthor(m.author.tag, m.author.displayAvatarURL)
    .setDescription(m.content)
    .setTimestamp(m.createdTimestamp)
    .setColor("RANDOM")
    message.channel.send(embed)
  }
}