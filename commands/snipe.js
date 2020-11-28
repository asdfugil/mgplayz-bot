const snipe = new (require("keyv"))("sqlite://.data/database.sqlite", {
  namespace: "snipe"
});
const { MessageEmbed } = require('discord.js')
module.exports = {
  name:'snipe',
  description:'view the last deleted message in the channel',
  async execute(message) {
    const m = await snipe.get(message.channel.id)
    if (!m) return message.channel.send("There's nothing to snipe!")
   // const attach = m.attachment.split(',').map(base64 => Buffer.from(base64,'base64'))
    const embed = new MessageEmbed()
    .setAuthor(m.author.tag, m.author.displayAvatarURL)
    .setDescription(m.content)
    .setTimestamp(m.createdTimestamp)
    .setColor("RANDOM")
    /*
    if (attach) {
    embed.attachFiles(attach);
    };
    */
    //BRUH ? can only be used in node 14
    message.channel.send(embed)
  }
}