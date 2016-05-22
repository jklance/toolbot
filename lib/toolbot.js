'use strict';

var util = require('util');
var Bot = require('slackbots');
var jobs = null;


var ToolBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'toolbot';

};

util.inherits(ToolBot, Bot);
module.exports = ToolBot;


ToolBot.prototype.run = function() {
    ToolBot.super_.call(this, this.settings);

    console.log('run test');
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

ToolBot.prototype._onStart = function() {
    console.log('_onStart test');
    this._getBotUserInfo();
    this._welcomeMessage();
};

ToolBot.prototype._getBotUserInfo = function() {
    console.log('_getBotUserInfo test');
    var self = this;
    this.user = this.users.filter(function(user) {
        return user.name === self.name;
    })[0];
};

ToolBot.prototype._welcomeMessage = function() {
    console.log('_welcomeMessage test');
    this.postMessageToChannel(
        this.channels[0].name, 
        "I am a ToolBot, I'm here to help out!"
    );
};

ToolBot.prototype._onMessage = function(message) {
    console.log('_onMessage test');
    if (this._isChatMessage(message) && this._isNotFromSelf(message) 
        && this._hasKeyword(message) && this._isNotFromBot(message)) {

        this._handleMessage(message);
    }
};

ToolBot.prototype._isChatMessage = function(message) {
    if (message.type === 'message' && message.text != null) {
        return true;
    }
    return false;
};

ToolBot.prototype._isNotFromSelf = function(message) {
    console.log("\n\nMESSAGE USER\n");
    console.log(message.username);
    console.log("\n\nTHIS USER\n");
    console.log(this.user.name);
    if (message.username === this.user.name) {
        return false;
    }
    return true;
};

ToolBot.prototype._hasKeyword = function(message) {
    if (message.text.toLowerCase().indexOf('keyword') > -1) {
        return true;
    }
    return false;
};

ToolBot.prototype._isNotFromBot = function(message) {
    if (message.subtype === 'bot_message') {
        return false;
    }
    return true;
};

ToolBot.prototype._handleMessage = function(message) {
    this.postMessageToChannel(this.channels[0].name, "I heard: " + message.text);
};

