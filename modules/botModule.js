const {
  MessageEmbed,
  Collection,
  TextBasedChannel,
  Message,
  GuildMember,
  WebhookClient,
  Guild
} = require("discord.js");
const Keyv = require("keyv");
const globalLogHooks = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "log-hooks"
});

module.exports = {
  noPerms: async (perms, c) => {
    const x = c.client.emojis.cache.find(x => x.name === "Error");
    const noPermission = new MessageEmbed()
      .setAuthor(c.client.user.tag, c.client.user.avatarURL)
      .setColor("#FF0000")
      .setDescription(`${x} You don't have enough permissions to use this command!**\nPermissions required: \`${perms}\``);
    return c.send(noPermission);
  },
  noBotPerms: async (perms, c) => {
    const x = c.client.emojis.cache.find(x => x.name === "Error");
    const noPermission = new MessageEmbed()
      .setColor("#FF0000")
      .setAuthor(c.client.user.tag, c.client.user.avatarURL)
      .setDescription(`${x} *I don't have enough permissions to execute this command! Permissions required: \`${perms}\``);
    return c.send(noPermission);
  },
  findMember: async (message, string) => {
    if (message.mentions.members.first())
      return message.mentions.members.first();
    else if (message.guild.members.cache.find(x => x.user.tag.includes(string)))
      return message.guild.members.cache.find(x => x.user.tag.includes(string));
    else if (message.guild.members.cache.find(x => x.displayName.includes(string)))
      return message.guild.members.cache.find(x => x.displayName.includes(string));
    else if (await message.guild.members.fetch(string))
      return await message.guild.members.fetch(string);
    else throw "Member not found.";
  },
  findUser: async (message, string) => {
    if (message.guild) {
      if (message.mentions.members.first())
        return message.mentions.users.first();
      else if (message.guild.members.cache.find(x => x.user.tag.includes(string)))
        return message.guild.members.cache.find(x => x.user.tag.includes(string))
          .user;
      else if (message.guild.members.cache.find(x => x.displayName.includes(string)))
        return message.guild.members.cache.find(x => x.displayName.includes(string))
          .user;
    } else if (message.mentions.users.first())
      return message.mentions.users.first();
    if (await message.client.users.fetch(string))
      return await message.client.users.fetch(string);
    else throw "User not found.";
  },
  getJoinRank: (ID, message) => {
    if (!message.guild.members.cache.has(ID)) return;

    let arr = message.guild.members.cache.array();
    arr.sort((a, b) => a.joinedAt - b.joinedAt);

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == ID) return i + 1;
    }
  },
  findBannedUser: async (message, string) => {
    const bans = await message.guild.fetchBans();
    let user = bans.find(x => x.tag.includes(string));
    if (user) return user;
    user = bans.find(x => string.includes(x.id)); //@memntions and ids
    return user;
  },
  decodeEntities: encodedString => {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
      nbsp: " ",
      amp: "&",
      quot: '"',
      lt: "<",
      gt: ">"
    };
    return encodedString
      .replace(translate_re, function(match, entity) {
        return translate[entity];
      })
      .replace(/&#(\d+);/gi, function(match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
      });
  },
  clean: text => {
    if (typeof text === "string")
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
  },
  Rank: class {
    constructor(xp) {
      "use strict";
      if (xp) {
        this.xp = xp;
      } else {
        this.xp = 0;
      }
      this.getLevel = function() {
        let xpRequiredToLevelUp = 100;
        let level = 1;
        let xpo = this.xp;
        for (let i = 0; xpo > 0; i++) {
          xpo = xpo - xpRequiredToLevelUp;
          xpRequiredToLevelUp += 100;
          level += 1;
        }
        level -= 1;
        return level;
      };
      this.getLevelXP = function() {
        let xpRequiredToLevelUp = 0;
        let xpo = this.xp;
        for (let i = 0; xpo > 0; i++) {
          xpo = xpo - xpRequiredToLevelUp;
          if (xpo > 0) {
            xpRequiredToLevelUp += 100;
          }
          i += 1;
        }
        return (
          Math.floor(xpRequiredToLevelUp + xpo) + "/" + xpRequiredToLevelUp
        );
      };
      this.toString = function() {
        return this.xp.toString();
      };
    }
  },
  deserialize: str => eval(`(${str})`),
  /**
   * Converts Collection into JSON.
   * @param collection A Collection in which all keys are strings
   */
  collection2json: function(collection) {
    const obj = {};
    if (collection instanceof Collection) {
      for (const key of collection.keys()) {
        const child = collection.get(key);
        if (child instanceof Collection) {
          obj[key] = this.collection2json(child);
        } else {
          obj[key] = child;
        }
      }
    } else {
      let error = new Error(
        "Expected class Collection, received class " +
          collection.constructor.name
      );
      throw error;
    }
    return obj;
  },
  findRole: (message, string) => {
    const { guild } = message;
    let role = message.mentions.roles.first();
    if (role) return role;
    else
      role = guild.roles.find(x =>
        x.name.toLownerCase().includes(string.toLowerCase())
      );
    if (role) return role;
    else role = guild.roles.find(x => x.hexColor === string);
    if (role) return role;
    else return guild.roles.get(string);
  },
  customEmbed: (a, b, c, d) => {
    const embed = new MessageEmbed()
      .setColor(a)
      .setTitle(b)
      .setDescription(c);
    return embed;
  },
  abbreviate: (number, usingGreekSuffixes = false, maxDigits = 2) => {
    if (
      typeof number !== "number" ||
      typeof usingGreekSuffixes !== "boolean" ||
      typeof maxDigits !== "number"
    )
      return "";
    if (number > 999) {
      var sign = Math.sign(number);
      number = Math.abs(number);
      var suffixes = "KMBTQ";
      var greekSuffixes = "KMGTPEZY";
      var divide = 10 ** (Math.floor(Math.log10(number)) - maxDigits);
      var index = Math.floor(Math.log10(number) / 3) - 1;
      if (index < 0)
        return sign === -1 ? "-" + number.toString() : number.toString();
      number = Math.floor(number / divide) * divide;
      if (!usingGreekSuffixes) {
        if (index > suffixes.length - 1) index = suffixes.length - 1;
        var result =
          (
            number /
            10 **
              (3 *
                (Math.floor(Math.log10(number) / 3) > suffixes.length
                  ? suffixes.length
                  : Math.floor(Math.log10(number) / 3)))
          ).toString() + suffixes[index];
        if (sign === -1) result = "-" + result;
        return result;
      } else {
        if (index > greekSuffixes.length - 1) index = greekSuffixes.length - 1;
        var result =
          (
            number /
            10 **
              (3 *
                (Math.floor(Math.log10(number) / 3) > greekSuffixes.length
                  ? greekSuffixes.length
                  : Math.floor(Math.log10(number) / 3)))
          ).toString() + greekSuffixes[index];
        if (sign === -1) result = "-" + result;
        return result;
      }
    }
    else return number;
  },
  toHHMMSS: secs => {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map(v => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  },
  stringToDate(_date, _format, _delimiter) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(
      dateItems[yearIndex],
      month,
      dateItems[dayIndex]
    );
    return formatedDate;
  },
  msToHMS: duration => {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "" + hours : hours;
    minutes = minutes < 10 ? "" + minutes : minutes;
    seconds = seconds < 10 ? "" + seconds : seconds;

    return [hours, minutes, seconds]
      .map(v => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  },
  invert: (ctx, x, y, width, height) => {
    const data = ctx.getImageData(x, y, width, height);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = 255 - data.data[i];
      data.data[i + 1] = 255 - data.data[i + 1];
      data.data[i + 2] = 255 - data.data[i + 2];
    }
    ctx.putImageData(data, x, y);
    return ctx;
  },
  distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
    const data = ctx.getImageData(x, y, width, height);
    const temp = ctx.getImageData(x, y, width, height);
    const stride = width * strideLevel;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const xs = Math.round(
          amplitude * Math.sin(2 * Math.PI * 3 * (j / height))
        );
        const ys = Math.round(
          amplitude * Math.cos(2 * Math.PI * 3 * (i / width))
        );
        const dest = j * stride + i * strideLevel;
        const src = (j + ys) * stride + (i + xs) * strideLevel;
        data.data[dest] = temp.data[src];
        data.data[dest + 1] = temp.data[src + 1];
        data.data[dest + 2] = temp.data[src + 2];
      }
    }
    ctx.putImageData(data, x, y);
    return ctx;
  },
  contrast(ctx, x, y, width, height) {
    const data = ctx.getImageData(x, y, width, height);
    const factor = 259 / 100 + 1;
    const intercept = 128 * (1 - factor);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = data.data[i] * factor + intercept;
      data.data[i + 1] = data.data[i + 1] * factor + intercept;
      data.data[i + 2] = data.data[i + 2] * factor + intercept;
    }
    ctx.putImageData(data, x, y);
    return ctx;
  },
  desaturate(ctx, level, x, y, width, height) {
    const data = ctx.getImageData(x, y, width, height);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const dest = (i * width + j) * 4;
        const grey = Number.parseInt(
          0.2125 * data.data[dest] +
            0.7154 * data.data[dest + 1] +
            0.0721 * data.data[dest + 2],
          10
        );
        data.data[dest] += level * (grey - data.data[dest]);
        data.data[dest + 1] += level * (grey - data.data[dest + 1]);
        data.data[dest + 2] += level * (grey - data.data[dest + 2]);
      }
    }
    ctx.putImageData(data, x, y);
    return ctx;
  },
  Tag: class {
    /**
     * Construct a tag
     * @param { string } name - The name of the tag
     * @param { string } content - The content of the tag
     * @param { boolean? } nsfw - Whether this tag is nsfw
     * @param { string? } description - The description of the tag
     * @param { number? } count - How many times this tag has been triggered
     * @returns The tag
     */
    constructor(name, content, nsfw, description, count) {
      this.name = name;
      this.content = content;
      this.nsfw = nsfw;
      this.description = description;
      this.count = count;
      if (typeof this.count === "undefined") this.count = 0;
      return this;
    }
  },
  json2collection: obj => {
    const collection = new Collection();
    for (const key of Object.keys(obj)) {
      const child = obj[key];

      if (child != null) {
        if (typeof child === "object") {
          collection.set(key, this.json2collection(child));
        } else {
          collection.set(key, child);
        }
      }
    }
    return collection;
  },
  abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
      var suffixes = ["", "K", "M", "B", "T"];
      var suffixNum = Math.floor(("" + value).length / 3);
      var shortValue = "";
      for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum != 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        );
        var dotLessShortValue = (shortValue + "").replace(
          /[^a-zA-Z 0-9]+/g,
          ""
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  },
  wrapText(ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText("W").width > maxWidth) return resolve(null);
      const words = text.split(" ");
      const lines = [];
      let line = "";
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) {
            words[1] = `${temp.slice(-1)}${words[1]}`;
          } else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
          line += `${words.shift()} `;
        } else {
          lines.push(line.trim());
          line = "";
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },
  shortenText(ctx, text, maxWidth) {
    let shorten = false;
    while (ctx.measureText(`${text}...`).width > maxWidth) {
      if (!shorten) shorten = true;
      text = text.substr(0, text.length - 1);
    }
    return shorten ? `${text}...` : text;
  },
  streamToArray(stream) {
    if (!stream.readable) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      const array = [];
      function onData(data) {
        array.push(data);
      }
      function onEnd(error) {
        if (error) reject(error);
        else resolve(array);
        cleanup();
      }
      function onClose() {
        resolve(array);
        cleanup();
      }
      function cleanup() {
        stream.removeListener("data", onData);
        stream.removeListener("end", onEnd);
        stream.removeListener("error", onEnd);
        stream.removeListener("close", onClose);
      }
      stream.on("data", onData);
      stream.on("end", onEnd);
      stream.on("error", onEnd);
      stream.on("close", onClose);
    });
  },
  drawImageWithTint(ctx, image, color, x, y, width, height) {
		const { fillStyle, globalAlpha } = ctx;
		ctx.fillStyle = color;
		ctx.drawImage(image, x, y, width, height);
		ctx.globalAlpha = 0.5;
		ctx.fillRect(x, y, width, height);
		ctx.fillStyle = fillStyle;
		ctx.globalAlpha = globalAlpha;
	}
};
