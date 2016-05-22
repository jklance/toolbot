'use strict';

var Bot = require('../lib/toolbot.js');

// create a bot
var settings = {
    token: process.env.BOT_API_KEY,
    name: process.env.BOT_NAME
};

var bot = new Bot(settings);

bot.run();


//bot.on('start', function() {
    //bot.postMessageToUser('jer_', 'Hello user!');
//});
