require('dotenv').config()
const config = require("../config.js");
const devsID = config.devsID;
module.exports = {
	name: 'reload',
	description: 'Reloads a command (bot developers only)',
  cooldown:0.1,
	args: true,
  usage:' <command>',
	execute:async (message, args) => {
  if (!devsID.includes(message.author.id)) return;
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
        let type = 'js'
        try {
			delete require.cache[require.resolve(`./${commandName}.js`)];
		} catch (error) {
			delete require.cache[require.resolve(`./${commandName}.mjs`)]
			type = 'mjs'
		}

		try {
			const newCommand = require(`./${commandName}.${type}`);
			message.client.commands.set(newCommand.name, newCommand);
		} catch (error) {
			console.log(error);
			return message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
		}
		message.channel.send(`Command \`${commandName}\` was reloaded!`);
	},
};