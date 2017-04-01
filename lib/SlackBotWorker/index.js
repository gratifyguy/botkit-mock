function SlackBotWorker(bot, botkit, config){
    bot.api = require('./api')(botkit, config || {}, require('./apiStorage'));
    bot.identity = {
        id: null,
        name: '',
    };

    bot.startTyping = function(src) {
        bot.reply(src, { type: 'typing' });
    };

    bot.replyWithTyping = function(src, resp, cb) {
        var typingLength = 10;

        bot.startTyping(src);

        setTimeout(function() {
            bot.reply(src, resp, cb);
        }, typingLength);
    };
}

module.exports = SlackBotWorker;