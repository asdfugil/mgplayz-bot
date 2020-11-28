const { MessageEmbed } = require("discord.js");
const ytsr = require("ytsr");

module.exports = {
  name: "channelinfo",
  description: "Search for a channel on YouTube.",
  usage: "<channelname/id>",
  args: 1,
  execute: async (message, args) => {
    const youtube = message.client.emojis.cache.find(e => e.name === "youtube");
    const x = message.client.emojis.cache.find(e => e.name === "Error");
    const result = (await ytsr(args.join(" "), { limit: 1 })).items.filter(
      a => a.type === "channel"
    );
    if (!result) return message.channel.send(`${x} **Couldn't find channel.**`)
    let subs;
   // if (result[0].subscribers < 999000)
    let channelavatar;
    if (result[0].avatar.includes("https:")) channelavatar = result[0].avatar
    else channelavatar = "https:" + result[0].avatar
    console.log(result[0])
    const embed = new MessageEmbed()
      .setAuthor(`${result[0].name}`, channelavatar)
      .setDescription(`${result[0].description_short}`)
      .addField(`Subscribers`, result[0].subscribers, true)
      .addField(`Uploads`, result[0].videos.toLocaleString("en-US"));
    message.channel.send(embed);
  }
};
