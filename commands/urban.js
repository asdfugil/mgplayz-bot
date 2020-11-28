const fetch = require("node-fetch");
const querystring = require("querystring");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "urban",
  description: "Search for a term or word in the Urban Dictionary",
  usage: "<term/word>",
  args: 1,
  cooldown: 4,
  execute: async (message, args) => {
    const query = querystring.stringify({ term: args.join(" ") });
    const { list } = await fetch(
      `https://api.urbandictionary.com/v0/define?${query}`
    ).then(response => response.json()).catch(() => {});
    if (!list.length)
      return message.channel.send(
        `No results found for **${args.join(" ")}**.`
      );
    const trim = (str, max) =>
      str.length > max ? `${str.slice(0, max - 3)}...` : str;
    const [answer] = list;

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(answer.word)
      .setURL(answer.permalink)
      .addField("Definition", trim(answer.definition, 1024))
      .addField("Example", trim(answer.example, 1024))
      .setFooter(`👍 ${answer.thumbs_up}  |  👎 ${answer.thumbs_down}`);

    message.channel.send(embed);
  }
};
