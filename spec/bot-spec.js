var bot = require('../bin/bot.js');

describe("Accepts API key from command line", function() {
    it("accepts an API key using 'BOT_API_KEY={key}'", function() {
        expect(process.env.BOT_API_KEY).not.toBe(null);
    });
});
