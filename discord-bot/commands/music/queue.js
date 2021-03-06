const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const MessageEmbed = require('../../lib/message/MessageEmbed');
const Command = require('../../lib/command/Command');

const Queue = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Queue.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue && server_queue.connection.dispatcher)
    {
        let queue_embed = new MessageEmbed(bot, msg.guild, false).setTitle('MUSIC QUEUE');

        server_queue.songs.forEach((song, index) => {
            let progress = (song == server_queue.playing.current) ? (`${bot.music_manager.secondsToDuration(Math.floor(server_queue.connection.dispatcher.streamTime / 1000))}/`) : ('');
            
            queue_embed.addField(`[${index}] ${song.title} (${progress}${bot.music_manager.secondsToDuration(song.duration)})`, song.url);
        });

        queue_embed.addField(`LOOP: ${server_queue.playing.loop_mode}`, `Queue size: ${server_queue.songs.length}`);
        msg.channel.send(queue_embed);
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.music_play);
    }
}

Queue.setHelp({
    name: 'queue',
    args: '',
    aliases: ['q', 'list', 'playlist'],
    description: 'displays music queue',
    permission: 'USER',
});

const error = Queue.error = {
    music_play: "Queue is empty."
};

module.exports = Queue;