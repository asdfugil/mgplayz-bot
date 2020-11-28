const discord = require("discord.js");
const { MessageEmbed } = discord;
const config = require("../config.js")
const devsID = config.devsID;

module.exports = {
  name: "restart",
  aliases: ["reconnect"],
  devOnly: true,
  execute: async (message, args) => {
    if (!devsID.includes(message.author.id)) return;
    const client = message.client;
    const check = client.emojis.cache.find(emoji => emoji.name === "Check");
    const x = client.emojis.cache.find(emoji => emoji.name === "Error");
    const loading = client.emojis.cache.find(
      emoji => emoji.name === "loadingdiscord"
    );
    const confirm = new MessageEmbed()
      .setAuthor(
        "Bot Restart",
        message.client.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024
        })
      )
      .setDescription(
        "Are you sure you wan't to restart the bot? (5 seconds to answer)\n`y` or `n`?"
      );
    message.channel.send(confirm);
    try {
      message.channel
        .createMessageCollector(x => x.author.id === message.author.id, {
          max: 1,
          time: 10000
        })
        .on("collect", async answer => {
          if (answer.content === "y" || answer.content === "yes") {
            const m = message.channel.send(`${loading} Bot restarting...`);
            m.then(() => {
              process
                .exit(1)
                .then(() => m.edit(`${check} Bot successfully restarted!`));
            });
          } else if (answer.content === "n" || answer.conent === "no") {
            message.channel.send(`${x} Bot restart cancelled`);
          } else {
            message.channel.send(`${x} Arguments invalid!`);
          }
        });
    } catch (error) {}
  }
};
