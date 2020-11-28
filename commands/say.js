module.exports = {
  name: "say",
  description: "Make the bot say something.",
  aliases: ["talk"],
  cooldown: 5,
  disableable: true,
  execute: (message, args) => {
  if (!args[0] && !message.attachments.first() && message.embeds[0]) return message.reply("please type something for the bot to say.")
  message.channel.send(args.join(" ") + "\n\n- " + message.author.tag, { 
    embed: message.embeds[0],
    files: message.attachments.array().map(x => x.proxyURL),
    split: true,
    tts: message.tts,
    disableEveryone: true
  });
  }
}