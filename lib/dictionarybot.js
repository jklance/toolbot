'use strict';

var Https    = require('https');
var XMLParse = require('xml2js');

var Config   = require('../lib/dictionarybot_config.json');

var DictionaryBot = function Constructor() {
    this.dictionaryAPI = Config.dictionaryAPI || '';
    this.dictionaryData = {};

};

module.exports = DictionaryBot;


DictionaryBot.prototype._handleDefineKeyword = function(message) {
    this._getWordToDefine(message);
    this._getDictionaryAPIHeaders();
    this._createDictionaryAPISearchUrlPath();
    this._getDictionaryAPIDefinitionUrl();

    return message;
};

DictionaryBot.prototype._getWordToDefine = function(message) {
    if (message.indexOf('.define ') === 0) {
        this.dictionaryData.word = message.replace('.define ', '');
    } else {
        this.dictionaryData.word = null;
    }
};


DictionaryBot.prototype._getDictionaryAPIHeaders = function() {
    this.dictionaryData.headers = {
        Accept:    this.dictionaryAPI.formatAccept,
        accessKey: this.dictionaryAPI.apiKey
    };
};

DictionaryBot.prototype._createDictionaryAPISearchUrlPath = function() {
    var pageSize = 1;
    var pageIndex = 1;
    this.dictionaryData.searchUrlPath = 
        "/api/v1/dictionaries/" 
        + this.dictionaryAPI.languageCode 
        + "/search/?q=" 
        + this.dictionaryData.word 
        + "&pagesize=" 
        + pageSize 
        + "&pageindex=" 
        + pageIndex;
};


DictionaryBot.prototype._getDictionaryAPIDefinitionUrl = function() {
    if (this.dictionaryData.word) {
        var options = {
            host: this.dictionaryAPI.apiUrlBase,
            path: this.dictionaryData.searchUrlPath,
            method: 'GET',
            headers: this.dictionaryData.headers
        };

        var bot = this;

        Https.get(options, function(response) {
            var message = '';

            response.on('data', function(chunk) {
                message += chunk;
            });
            response.on('end', function() {
                var msgParsed = JSON.parse(message);
                bot.dictionaryData.definitionUrl = msgParsed.results[0].entryUrl;
                bot.dictionaryData.haveDefinitionUrl = true; // This is solely for unit testing

                //bot._getDictionaryAPIDefinition();
            });
        });
    } else {
        this.dictionaryData.definitionUrl = null;
    }
};

DictionaryBot.prototype._getDictionaryAPIDefinition = function() {
    if (this.dictionaryData.word && this.dictionaryData) {
        var urlPath = this.dictionaryData.definitionUrl.split("api.collinsdictionary.com")[1] + "?format=xml";

        var options = {
            host: this.dictionaryAPI.apiUrlBase,
            path: urlPath,
            method: 'GET',
            headers: this.dictionaryData.headers
        };

        var bot = this;

        Https.get(options, function(response) {
            var message = '';

            response.on('data', function(chunk) {
                message += chunk;
            });
            response.on('end', function() {
                var msgParsed = JSON.parse(message);
                bot.dictionaryData.definition = msgParsed;
                bot.dictionaryData.haveDefinition = true; // This is solely for unit testing

                bot._parseDictionaryDefinitionResponse();
            });
        });
    } else {
        this.dictionaryData.definition = null;
    }
};

DictionaryBot.prototype._parseDictionaryDefinitionResponse = function() {
    if (this.dictionaryData.definition) {
        var bot = this;
        var definitionMsg = '';

        
        XMLParse.parseString(this.dictionaryData.definition.entryContent, function(e, result) {
            result = JSON.parse(JSON.stringify(result));
            result = result.entry.hom;

            result.forEach(function (elem, ind) {
                definitionMsg += "  > " + elem.sense[0].def[0] + "\n";    
            });
        
            bot.dictionaryData.definition = definitionMsg;
            bot._createDefinitionMessage();
        });

    }
};

DictionaryBot.prototype._createDefinitionMessage = function() {
    this.dictionaryData.message = '';

    if (this.dictionaryData.word && this.dictionaryData.definition 
        && typeof this.dictionaryData.definition === "string") {

        this.dictionaryData.message += "*" + this.dictionaryData.word + "*\n";
        this.dictionaryData.message += this.dictionaryData.definition;
    } else {
        this.dictionaryData.message = "The word *" + this.dictionaryData.word + "* was not found...\n";
    }
};

DictionaryBot.prototype.getDefinitionMessage = function() {
    if (this.dictionaryData.message) {
        return this.dictionaryData.message;
    }

    return null;
};




