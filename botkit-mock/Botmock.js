var async = require('async');
var Botkit = require('botkit');
var BotmockWorker = require('./BotmockWorker');


function BotMock(configuration){
    // Create a core botkit bot
    var botmock_botkit = Botkit.core(configuration);

    //override default botkit startTicking
    botmock_botkit.startTicking = function() {
        if (!botmock_botkit.tickInterval) {
            // set up a once a second tick to process messages
            botmock_botkit.tickInterval = setInterval(function() {
                botmock_botkit.tick();
            }, 10);
        }
    };

    botmock_botkit.on('message_received', function(bot, message){
        return botmock_botkit.trigger(message.type, [bot, message]);
    });

    botmock_botkit.defineBot(BotmockWorker);

    return botmock_botkit;
}

module.exports = BotMock;