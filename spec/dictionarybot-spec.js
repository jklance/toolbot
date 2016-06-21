var dictionarybot = require ('../lib/dictionarybot.js');

var bot=null;

beforeEach(function() {
    bot = new dictionarybot();
});

describe("Dictionarybot's base library exists", function() {
    it("can load the library", function() {
        expect(bot).toBeDefined();
    });

    it("can load the config file", function() {
        expect(bot.dictionaryAPI.formatAccept).toBe('application/json');
    });

    it("can prepare the correct API headers", function() {
        bot._getDictionaryAPIHeaders();
        expect(bot.dictionaryData.headers.Accept).toBe('application/json');
    });
});

describe("Dictionarybot answers to the 'define' keyword", function() {
    it("receives a message", function() {
        expect(bot._handleDefineKeyword('.define test')).toBe('.define test');
    });

    it("extracts the word from the message", function() {
        bot._getWordToDefine('.define test');
        expect(bot.dictionaryData.word).toBe('test');
    });

    it("returns a null string when the message doesn't have the .define keyword at the start", function() {
        bot._getWordToDefine('test');
        expect(bot.dictionaryData.word).toBeNull();
    });

    it("creates an API URL path to search for a valid word", function() {
        var expectedPath = '/api/v1/dictionaries/english/search/?q=test&pagesize=1&pageindex=1'

        bot.dictionaryData.word = 'test';
        bot._createDictionaryAPISearchUrlPath();

        expect(bot.dictionaryData.searchUrlPath).toBe(expectedPath);
    });

    xit("finds an API URL for a valid word", function() {
        bot.dictionaryData.word = 'test';
        bot._getDictionaryAPIHeaders();
        bot._createDictionaryAPISearchUrlPath();

        var expected = 'http://api.collinsdictionary.com/api/v1/dictionaries/english/entries/test_1';

        runs(function() {
            bot._getDictionaryAPIDefinitionUrl();
        }, 5000);
        waitsFor(function() {
            return bot.dictionaryData.haveDefinitionUrl;
        }, "definition url should be in", 5500);
        runs(function() {
            expect(bot.dictionaryData.definitionUrl).toBe(expected);
        });
    });

    xit("gets a response from a valid definition URL", function() {
        bot.dictionaryData.word          = 'test';
        bot.dictionaryData.definitionUrl = 'http://api.collinsdictionary.com/api/v1/dictionaries/english/entries/test_1';
        bot._getDictionaryAPIHeaders();
        
        var expected = 'english';

        runs(function() {
            bot._getDictionaryAPIDefinition();
        }, 7000);
        waitsFor(function() {
            return bot.dictionaryData.haveDefinition;
        }, "definition should be in", 7500);
        runs(function() {
            expect(bot.dictionaryData.definition.dictionaryCode).toBe(expected);
        });
    });

    it("parses a definition from a retrieved definition message", function() {
        bot.dictionaryData.definition = { 
            topics: [],
            dictionaryCode: 'english',
            entryContent: '<?xml version="1.0" encoding="utf-8"?>\n<entry id="test_1" idm_id="000169582" mld-id="w0090480,w0090490,w0202470" lang="en-gb"><form><orth>test<span cd="yes" class="homnum">1</span></orth><span> (</span><pron type="">tɛst<audio type="pronunciation" title="test1"><source type="audio/mpeg" src="https://api.collinsdictionary.com/media/sounds/sounds/5/564/56446/56446.mp3"/>Your browser does not support HTML5 audio.</audio></pron><span>)</span></form><hom id="test_1.1"><gramGrp><span>   </span><pos>verb</pos></gramGrp><sense n="1"><span class="sensenum">     1 </span><def>to ascertain (the worth, capability, or endurance) of (a person or thing) by subjection to certain examinations; try</def></sense><sense n="2"><span class="sensenum">     2 </span><gramGrp><subc><span>(</span><hi rend="r">often followed by</hi> for<span>)</span></subc></gramGrp><span> </span><def>to carry out an examination on (a substance, material, or system) by applying some chemical or physical procedure designed to indicate the presence of a substance or the possession of a property</def><cit type="example" id="test_1.2"><quote><span> ■ </span>to test food for arsenic</quote><quote><span> ■ </span>to test for magnetization</quote></cit></sense><sense n="3"><span class="sensenum">     3 </span><gramGrp><subc><span>(</span>intransitive<span>)</span></subc></gramGrp><span> </span><def>to achieve a specified result in a test</def><cit type="example" id="test_1.3"><quote><span> ■ </span>a quarter of the patients at the clinic tested positive for the AIDS virus</quote></cit></sense><sense n="4"><span class="sensenum">     4 </span><gramGrp><subc><span>(</span>transitive<span>)</span></subc></gramGrp><span> </span><def>to put under severe strain</def><cit type="example" id="test_1.4"><quote><span> ■ </span>the long delay tested my patience</quote></cit></sense><sense id="test_1.5" n="5"><span class="sensenum">     5 </span><re><xr type="child"> See <ref target="test-the-water_1" resource="english">test the water</ref></xr></re></sense></hom><hom id="test_1.6"><span><br/>▷ </span><gramGrp><pos>noun</pos></gramGrp><sense n="6"><span class="sensenum">     6 </span><def>a method, practice, or examination designed to test a person or thing</def></sense><sense n="7"><span class="sensenum">     7 </span><def>a series of questions or problems designed to test a specific skill or knowledge</def><cit type="example" id="test_1.7"><quote><span> ■ </span>an intelligence test</quote></cit></sense><sense n="8"><span class="sensenum">     8 </span><def>a standard of judgment; criterion</def></sense><sense n="9"><span class="sensenum">     9 </span><sense n="1"><span class="sensenum">   a </span><def>a chemical reaction or physical procedure for testing a substance, material, etc</def></sense><sense n="2"><span class="sensenum">   b </span><def>a chemical reagent used in such a procedure</def><cit type="example" id="test_1.8"><quote><span> ■ </span>litmus is a test for acids</quote></cit></sense><sense n="3"><span class="sensenum">   c </span><def>the result of the procedure or the evidence gained from it</def><cit type="example" id="test_1.9"><quote><span> ■ </span>the test for alcohol was positive</quote></cit></sense></sense><sense n="10"><span class="sensenum">     10 </span><lbl type="subj">sport</lbl><xr><span> </span><lbl>See</lbl><span> </span><ref target="test-match_1" resource="english">test match</ref></xr></sense><sense n="11"><span class="sensenum">     11 </span><lbl type="register">archaic</lbl><span> </span><def>a declaration or confirmation of truth, loyalty, etc; oath</def></sense><sense n="12"><span class="sensenum">     12 </span><gramGrp><subc><span>(</span>modifier<span>)</span></subc></gramGrp><span> </span><def>performed as a test</def><cit type="example" id="test_1.10"><quote><span> ■ </span>test drive</quote><quote><span> ■ </span>test flight</quote></cit></sense></hom><etym><span>   [</span>C14 (in the sense: vessel used in treating metals): from Latin <hi rend="i">testum</hi> earthen vessel<span>]</span></etym><re type="drv" id="test_1.11"><span><br/>&gt; </span><form type="drv"><orth>ˈtestable</orth></form><hom id="test_1.12"><gramGrp><span> </span><pos>adjective</pos></gramGrp></hom></re><re type="drv" id="test_1.13"><span>   &gt; </span><form type="drv"><orth>ˌtestaˈbility</orth></form><hom id="test_1.14"><gramGrp><span> </span><pos>noun</pos></gramGrp></hom></re><re type="drv" id="test_1.15"><span>   &gt; </span><form type="drv"><orth>ˈtesting</orth></form><hom id="test_1.16"><gramGrp><span> </span><pos>adjective</pos></gramGrp></hom></re><form type="inflected"><orth>tests</orth><orth>testing</orth><orth>tested</orth></form><form type="inflected"><orth>tests</orth></form><form type="inflected"><orth>tests</orth></form></entry>\n',
            entryLabel: 'test 1',
            entryUrl: 'http://api.collinsdictionary.com/api/v1/dictionaries/english/entries/test_1',
            format: 'xml',
            entryId: 'test_1' 
        };

        var expected = "  > to ascertain (the worth, capability, or endurance) of (a person or thing) by subjection to certain examinations; try\n  > a method, practice, or examination designed to test a person or thing\n";

        bot._parseDictionaryDefinitionResponse();
        expect(bot.dictionaryData.definition).toBe(expected);
    });

    it("creates a message response from an existing definition", function() {
        bot.dictionaryData.word = "test";
        bot.dictionaryData.definition = "  > to ascertain (the worth, capability, or endurance) of (a person or thing) by subjection to certain examinations; try\n  > a method, practice, or examination designed to test a person or thing\n";

        var expected = "*test*\n  > to ascertain (the worth, capability, or endurance) of (a person or thing) by subjection to certain examinations; try\n  > a method, practice, or examination designed to test a person or thing\n";

        bot._createDefinitionMessage();
        expect(bot.dictionaryData.message).toBe(expected);
    });

    it("looks up a word provided in a message and stores a definition in a message", function() {
        var expected = '';

        runs(function() {
            bot._handleDefineKeyword('.define test');
        }, 7000);
        waitsFor(function() {
            return bot.dictionaryData.haveDefinition;
        }, "definition should be in", 7500);
        runs(function() {
            expect(bot.dictionaryData.definition).toBe(expected);
        });

    });
});
