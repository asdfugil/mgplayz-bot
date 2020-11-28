require("dotenv").config();
const Discord = require("discord.js");
const config = require("./config.js");
const prefix = config.defaultPrefix;
const fs = require("fs");
const Keyv = require("keyv");
class BotClient extends Discord.Client {
  constructor(clientOptions) {
    super(clientOptions);
    this.commands = new Discord.Collection();
    this.queue = new Discord.Collection();
  }
}
const client = new BotClient({
  ws: { intents: 32767 },
  partials: ["USER", "CHANNEL", "REACTION", "MESSAGE"],
  http: {
    version: 7,
    api: "https://discord.com/api"
  },
  disableMentions: "everyone"
});
const fetch = require("node-fetch");
const ranks = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "ranks"
});
const check = require("./modules/check.js");
const processRank = require("./modules/ranks.js");
const cooldowns = new Discord.Collection();
const prefixs = new Keyv("sqlite://./.data/database.sqlite", {
  namespace: "prefixs"
});
const currency = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "currency"
});
const snipe = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "snipe"
});
Discord.Guild.prototype["xpCooldowns"] = new Discord.Collection();
const disabledCommands = new Keyv("sqlite://././.data/database.sqlite", {
  namespace: "disabledCommands"
});
const editsnipe = new Keyv("sqlite://././././.data/database.sqlite", {
  namespace: "editsnipe"
});
const { clean } = require("./modules/botModule.js");
const { MessageEmbed } = Discord;
const mutedutil = require("./modules/muted.js");
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  try {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  } catch (error) {
    console.error(error);
  }
}
client.once("ready", async () => {
  mutedutil.mutedTimers(client);
  mutedutil.updateMutedRoles(client);
  mutedutil.autoReMute(client);
  mutedutil.autoUpdateDataBase(client);
});
client.on("ready", async () => {
  check(client);
  await client.user.setActivity(`Send ${prefix}help for a list of commands!`, {
    type: "PLAYING"
  });
  client.user.setStatus("online");
});
client.on("shardReady", shard => {
  console.log(`Shard ${shard} ready!`);
});
ranks.on("error", console.error);
process.on("unhandledRejection", error => console.error(error));
client.on("voiceStateUpdate", (oldState, newState) => {
  const voiceQueue = oldState.client.queue.get(oldState.guild.id);
  if (!voiceQueue) return;
  if (
    newState.member.id === client.user.id &&
    oldState.member.id === client.user.id
  ) {
    // if the bot is force-disconnected
    if (newState.member.voice.channel === null) {
      voiceQueue.songs = [];
      voiceQueue.looping = false;
      return oldState.client.queue.delete(newState.guild.id);
    }
    // if the bot gets moved from another channel
    if (newState.member.voice.channel !== voiceQueue.voiceChannel) {
      voiceQueue.voiceChannel = newState.member.voice.channel;
      voiceQueue.connection = newState.connection;
    }
  }
});
client.on("messageDelete", async message => {
  if (message.author.bot) return;
  snipe.set(
    message.channel.id,
    {
      content: message.content,
      author: {
        tag: message.author.tag,
        displayAvatarURL: message.author.displayAvatarURL()
      },
      createdTimestamp: message.createdTimestamp
    },
    72000
  );
});
client.on("messageUpdate", async message => {
  if (message.author.bot) return;
  editsnipe.set(
    message.channel.id,
    {
      content: message.content,
      author: {
        tag: message.author.tag,
        displayAvatarURL: message.author.displayAvatarURL()
      },
      createdTimestamp: message.createdTimestamp
    },
    72000
  );
});
/*
client.on("error", (error, message) => {
  console.error(error);
);
*/
client.on("message", async message => {
  let actualPrefix = prefix;
  let disabled;
  if (!message.guild) return;
  if (message.guild) {
    if (await prefixs.get(message.guild.id))
      actualPrefix = await prefixs.get(message.guild.id);
  }
  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(actualPrefix)})\\s*`
  );
  if (
    [`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(message.content)
  )
    message.channel.send(
      "Hi! My Prefix for this guild is `" +
        actualPrefix +
        "`\nTo get started, type " +
        actualPrefix +
        "help."
    );
  processRank(message, ranks);
  if (!prefixRegex.test(message.content) || message.author.bot) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content
    .slice(matchedPrefix.length)
    .trim()
    .split(" ");
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    ) ||
    client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));


  if (!command) return;

  console.log(`${message.author.username} executed ${commandName}!
   Arguments: ${args.join(" ")}
   Guild: ${message.guild.name}`);

  // this executes if the user didn't provide enough arguments
  if (command.args && !args.length) {
    const usage = new MessageEmbed();
    const wrong = message.client.emojis.cache.find(e => e.name === "Error");
    usage.setAuthor(message.author.tag, message.author.displayAvatarURL());
    usage.setColor("RANDOM");
    let reply = []; //  `You didn't provide any arguments, ${message.author}!`;
    reply.push(`${wrong} Invalid arguments given.`);
    if (command.devOnly) {
      if (!config.devsID.includes(message.author.id)) return;
    }
    if (command.usage) {
      reply.push(
        `\nUsage: \n\`${actualPrefix}${command.name} ${command.usage}\``
      );
    }
    usage.setDescription(reply, { split: true });
    return message.channel.send(usage);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      const minute = Math.floor((timeLeft % 3600) / 60);
      const hour = Math.floor(timeLeft / 3600);
      const plswait = new MessageEmbed()
        .setTitle(":stopwatch: Cooldown")
        .setColor("RANDOM");
      if (timeLeft.toFixed() === 1)
        plswait.setDescription(
          `Wait **${timeLeft.toFixed()} second** before using this command.`
        );
      else if (timeLeft.toFixed(1) < 1)
        plswait.setDescription(
          `Wait **${timeLeft.toFixed(1)} seconds** before using this command.`
        );
      else if (timeLeft.toFixed() > 60) {
        if (minute === 1)
          plswait.setDescription(
            `Wait **${minute} minute** before using this command.`
          );
        else
          plswait.setDescription(
            `Wait **${minute} minutes** before using this command.`
          );
      } else if (timeLeft.toFixed() > 3600) {
        if (hour === 1)
          plswait.setDescription(
            `Wait **${hour} hour** before using this command.`
          );
        else
          plswait.setDescription(
            `Wait **${hour} hours** before using this command.`
          );
      } else
        plswait.setDescription(
          `Wait **${timeLeft.toFixed()} seconds** before using this command.`
        );
      return message.channel.send(plswait);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    await command.execute(message, args);
   } catch (error)
    console.error(error);
  }
});
client.login(process.env.BOT_TOKEN);
