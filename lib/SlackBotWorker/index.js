function SlackBotWorker(bot, botkit, config){
    var Storage = require('./apiStorage');
    bot.api = require('./api')(botkit, config || {}, new Storage());
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

    bot.startConversation = function(message, cb) {
        botkit.startConversation(this, message, cb);
    };

    bot.replyInteractive = function(src, resp, cb) {
        var msg = {};

        if (typeof(resp) == 'string') {
            msg.text = resp;
        } else {
            msg = resp;
        }

        msg.channel = src.channel;

        // if source message is in a thread, reply should also be in the thread
        if (src.thread_ts) {
            msg.thread_ts = src.thread_ts;
        }

        var requestOptions = {
            uri: src.response_url,
            method: 'POST',
            json: msg
        };
        bot.api.callAPI('replyInteractive', requestOptions, function (err, resp, body) {
            /**
             * Do something?
             */
            if (err) {
                botkit.log.error('Error sending interactive message response:', err);
                cb && cb(err);
            } else {
                cb && cb();
            }
        });
    }

    bot.startConversationInThread = function(message, cb) {
        // make replies happen in a thread
        if (!message.thread_ts) {
            message.thread_ts = message.ts;
        }
        botkit.startConversation(this, message, cb);
    };

    bot.createConversation = function(message, cb) {
        botkit.createConversation(this, message, cb);
    };

    bot.createConversationInThread = function(message, cb) {
        // make replies happen in a thread
        if (!message.thread_ts) {
            message.thread_ts = message.ts;
        }
        botkit.createConversation(this, message, cb);
    };
}

module.exports = SlackBotWorker;