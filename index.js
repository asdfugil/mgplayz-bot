 // Bot Sharding Manager
const { ShardingManager } = require("discord.js");
const manager = new ShardingManager("./main.js", {
  token: `${process.env.BOT_TOKEN}`
});
manager.on('shardCreate', shard => console.log(`Shard ${shard.id} created.`));
manager.on('message', (shard, message) => {
	console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});
manager.spawn(1, 990).catch(e => {
  console.error(e.stack);
  return;
});