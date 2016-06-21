'use strict';

var util     = require('util');
var Bot      = require('slackbots');
var Https    = require('https');
var XMLParse = require('xml2js');

var Dictionary = require('dictionarybot.js');

var Config = require('../toolbot_config.json');

var ToolBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'toolbot';

    this.dictionaryAPI = Config.dictionaryAPI;

    this.keywords = {
        define: 'Retrieve the definition of the following word from Google'
    };
};

util.inherits(ToolBot, Bot);
module.exports = ToolBot;


ToolBot.prototype.run = function() {
    ToolBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};


ToolBot.prototype._addKeywords = function(keywordStorage) {
    keywordStorage.forEach( function(sublist) {
        sublist.forEach( function(keyword) {
            this.keywords.push(keyword);
        })
    })
};

ToolBot.prototype._onStart = function() {
    this._getBotUserInfo();
    this._welcomeMessage();
    this._testUrlConnection();
};

ToolBot.prototype._getBotUserInfo = function() {
    var self = this;
    this.user = this.users.filter(function(user) {
        return user.name === self.name;
    })[0];
};

ToolBot.prototype._welcomeMessage = function() {
    this.postMessageToChannel(
        this.channels[0].name, 
        "I am a ToolBot, I'm here to help out!"
    );
};

ToolBot.prototype._onMessage = function(message) {
    var keyword;

    if (this._isChatMessage(message) && this._isNotFromSelf(message) 
        && (keyword = this._hasKeyword(message)) && this._isNotFromBot(message)) {
        
        this._handleMessage(keyword, message);
    }
};

ToolBot.prototype._isChatMessage = function(message) {
    if (message.type === 'message' && message.text != null) {
        return true;
    }
    return false;
};

ToolBot.prototype._isNotFromSelf = function(message) {
    if (message.username === this.user.name) {
        return false;
    }
    return true;
};

ToolBot.prototype._hasKeyword = function(message) {
    var result = false;

    Object.keys(this.keywords).forEach(function(keyword) {
        if (message.text.toLowerCase().indexOf('.' + keyword + ' ') ==  0) {
            result = keyword;
        }
    });
    return result;
};

ToolBot.prototype._isNotFromBot = function(message) {
    if (message.subtype === 'bot_message') {
        return false;
    }
    return true;
};

ToolBot.prototype._handleMessage = function(keyword, message) {
    this.postMessageToChannel(this.channels[0].name, "I heard: " + message.text);

    switch (keyword) {
        case 'define':
            this._handleDefineKeyword(message);
            break;
    }
};


