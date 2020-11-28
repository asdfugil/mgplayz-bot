const { prefix } = require("../config.js");
const { MessageEmbed } = require("discord.js");
const Keyv = require("keyv");
const prefixs = new Keyv("sqlite://./.data/database.sqlite", { namespace: "prefixs" });
const config = require("../config.js");

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  aliases: ["commands"],
  usage: "[command name]",
  cooldown: 5,
  disableable: false,
  execute: async (message, args) => {
    let actualPrefix = config.defaultPrefix;
    if (await prefixs.get(message.guild.id)) actualPrefix = await prefixs.get(message.guild.id);
    const client = message.client;
    const data = [];
    const data1 = [];
    const data2 = [];
    const data3 = [];
    const data4 = [];
    const data5 = [];
    const { commands } = message.client;
    const cmd3 = commands.filter(c => !c.devOnly);
    const cmd4 = commands.filter(c => c.devOnly);
    if (!args.length) {
      if (!config.devsID.includes(message.member.id)) data.push(cmd3.map(command => command.name).join(", "));
      else data.push(commands.map(command => command.name).join(", ")); 
      data.push(
        `\nSend \`${prefix}help [command name]\` to get more info on a command.`
      );
      const helpembed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(data, {split: true })
      .setTimestamp()
      return message.author
        .send(helpembed)
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("I've sent you a DM with all my commands!");
        })
        .catch(error => {
          message.channel.send(helpembed);  
        });
    }
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find(c => c.aliases && c.aliases.includes(name)) ||
      commands.find(c => c.alias && c.alias.includes(name));
    
    if (!command) {
      return message.reply("that's not a valid command!");
    }
    const cmdinf = new MessageEmbed()
    .setColor("RANDOM")
    data1.push(`${command.name}`);
    cmdinf.setTitle(`❔ command:${data1}`)
    
    if (command.description) {
      data3.push(`${command.description}`);
      cmdinf.setDescription(data3);
    }
    if (command.usage) {
      data2.push("`" + `${actualPrefix}${command.name} ${command.usage}` + "`");
      cmdinf.addField("Usage", data2)
    }
    if (command.aliases) {
      data4.push(`${command.aliases.join(", ")}`);
      cmdinf.addField("Aliases", data4)
    }
    if (command.cooldown) {
      data5.push(`${command.cooldown || 3} seconds`);
      cmdinf.addField("Cooldown", data5)
    }
    message.channel.send(cmdinf);
  }
};
