module.exports = {
  name: "connect",
  description: "Connects the bot to a voice channel.",
  cooldown: 1.5,
  aliases: ["summon"],
  args: false,
  execute: async message => {
    const client = message.client;
    const voice = message.member.voice.channel;
    const loading = client.emojis.cache.find(
      emoji => emoji.name === "loadingdiscord"
    );
    if (!voice) return message.reply("you must be in a voice channel!");
    if (message.guild.me.voiceChannel)
      return message.channel.send("I am already in a voice channel.");
    message.channel.send(`${loading} Connecting...`).then(m => {
      voice.join();
      m.edit(
        `:mailbox_with_mail: **Sucessfully connected to <#${voice.id}>**.`
      );
    });
  }
};
