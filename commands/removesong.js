module.exports = {
  name: "removesong",
  description: "Removes a song from the queue.",
  cooldown: 5,
  execute: async (message, args) => {
    const client = message.client;
    const x = client.emojis.cache.find(e => e.name === "Error");
    const check = client.emojis.cache.find(e => e.name === "Check");
    const serverQueue = message.client.queue.get(message.guild.id)
    const num = parseInt(args[0]);
    if (!message.member.voice.channel) message.channel.send(`${x} **Connect to a voice channel and try again.**`);
    if (!serverQueue) message.channel.send(`${x} **There is nothing playing.**`);
    if (isNaN(num) || num < 2 || num > (serverQueue.songs.length + 1)) return message.channel.send(`${x} **Number is out of range or invalid.**`)
    const removed = serverQueue.songs.splice(num - 1, 1);
    message.channel.send(`${check} **\`${removed[0].title}\` is now removed from the queue!**`)
  }
}