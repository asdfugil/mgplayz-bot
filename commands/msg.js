module.exports = {
  name: "msg",
  devOnly: true,
  cooldown: 0.0001,
  execute: (message, args) => {
    if (!args) return;
    message.client.channels.cache.get("717911860443349033").send(args.join(" "));
  }
}