module.exports = {
  name: "8ball",
  args: true, //<-- there must be arguments (already checked)
  usage: "<text>",
  disableable: true,
  description: "8ball",
  cooldown: 5,
  rand () {
    const answers = [
        "No.",
        "Maybe.",
        "Probably not.",
        "It is certain.", 
        "It is decidedly so.", 
        "Without a doubt.", 
        "Yes – definitely.", 
        "You may rely on it.", 
        "As I see it, yes.", 
        "Most Likely.", 
        "Outlook good.", 
        "Yes.", 
        "Signs point to yes.",
        "Don’t count on it.", 
        "My reply is no.", 
        "My sources say no.", 
        "Outlook not so good.", 
        "Reply hazy.", 
        "Try again.", 
        "Ask again later.", 
        "Better not tell you now.", 
        "Cannot predict now.", 
        "Concentrate and ask again."
    ]
    return answers[Math.floor(Math.random() * answers.length)];
  },
 execute (message) { message.channel.send("🎱 " + module.exports.rand()) }
};