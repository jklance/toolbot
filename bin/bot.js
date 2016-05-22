'use strict';

var Bot = require('slackbots');

// create a bot
var settings = {
    token: process.env.BOT_API_KEY,
    name: 'toolbot'
};
var bot = new Bot(settings);

bot.on('start', function() {
    bot.postMessageToChannel('general', 'Hello channel!');
    bot.postMessageToUser('jer_', 'Hello user!');
});
