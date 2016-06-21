var toolbot = require ('../lib/toolbot.js');

var bot=null;

beforeEach(function() {
    var settings = {
        token: process.env.BOT_API_KEY,
        name: process.env.BOT_NAME
    };

    bot = new toolbot(settings);
});

describe("Toolbot's base library exists", function() {
    it("can load the library", function() {
        expect(bot).toBeDefined();
    });
});
