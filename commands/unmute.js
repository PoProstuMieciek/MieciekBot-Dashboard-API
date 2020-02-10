const Discord = require("discord.js");
const mongoose = require("mongoose");

const Settings = require("../models/settings.js");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();

    if(!user.kickable || user.id == msg.author.id)
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.not_mutable).then(msg => msg.delete(bot.delete_timeout));
    }

    let role_index = bot.settings.roles.name.findIndex(res => res == "MUTE");
    let mute_role = msg.guild.roles.find(role => role.id == bot.settings.roles.id[role_index]);

    role_index = bot.settings.roles.name.findIndex(res => res == "USER");
    let user_role = msg.guild.roles.find(role => role.id == bot.settings.roles.id[role_index]);
    if(!mute_role)
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(`Muted role (${bot.settings.roles.id[0]}) was not found on the server. Please, edit your configuration.`)
        .then(msg => msg.delete(bot.delete_timeout));
    }

    let mute_embed = new Discord.RichEmbed()
    .setTitle(`You have been unmuted on ${msg.guild.name}!`)
    .setThumbnail(msg.guild.iconURL)
    .addField(`Unmuted by:`, msg.author.username)
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);
        
    let info_mute = new Discord.RichEmbed()
    .setTitle(`${user.displayName} has been unmuted!`)
    .setThumbnail(msg.guild.iconURL)
    .addField(`Unmuted by:`, msg.author.username)
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

    msg.delete();

    user.send(mute_embed);
    msg.channel.send(info_mute);

    user.addRole(user_role);
    user.removeRole(mute_role);
}

module.exports.help = {
    name: "unmute",
    aliases: [],
    args: [
        "<@user>"
    ],
    permission: "ADMIN",
    description: "unmutes <@user>"
}

module.exports.error = {
    "unknown": "Unknown error occurred. Please, try again later.",
    "not_mutable": "I cannot unmute this user."
}