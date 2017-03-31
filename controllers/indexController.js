module.exports = function(controller){
	// simple answer
	controller.hears(['help'], 'direct_message', function(bot, message){
        bot.reply(message, 'help message');
    });

    controller.hears(['hello bot reply'], 'direct_message', function(bot, message){
	    bot.reply(message, 'hello bot reply');
    });

    controller.hears(['hello bot say'], 'direct_message', function(bot, message){
        message.text = 'hello bot say';
        bot.say(message);
    });

    controller.hears(['hello bot direct'], 'direct_mention', function(bot, message){
        bot.reply(message, 'hello bot direct_mention');
    });

    controller.hears(['hello bot direct'], 'direct_message', function(bot, message){
        bot.reply(message, 'hello bot direct_message');
    });

    controller.hears(['hello bot multiple'], ['direct_message', 'ambient', 'mention'], function(bot, message){
        bot.reply(message, 'hello bot multiple');
    });

    controller.hears(['reply with typing'], 'direct_message', function(bot, message){
        bot.replyWithTyping(message, 'hello reply with typing');
    });

    // simple conversation
	controller.hears(['hi'], 'direct_message', function(bot, message){
		bot.startConversation(message, function(response, convo){
			convo.ask('hey there', function(response, convo){
				convo.say('..user typed any text after `hi`');
				convo.ask('here a question', function(response, convo){
					convo.say('here an answer');
					convo.next();
				});
				convo.next();
			})
		})
    });

};
