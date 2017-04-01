function FacebookBotWorker(bot, botkit, config){
    bot.startTyping = function(src, cb) {
        var msg = {};
        msg.channel = src.channel;
        msg.sender_action = 'typing_on';
        bot.say(msg, cb);
    };

    bot.stopTyping = function(src, cb) {
        var msg = {};
        msg.channel = src.channel;
        msg.sender_action = 'typing_off';
        bot.say(msg, cb);
    };

    bot.replyWithTyping = function(src, resp, cb) {
        var typingLength = 10;

        bot.startTyping(src, function(err) {
            if (err) console.log(err);
            setTimeout(function() {
                bot.reply(src, resp, cb);
            }, typingLength);
        });

    };
}

module.exports = FacebookBotWorker;