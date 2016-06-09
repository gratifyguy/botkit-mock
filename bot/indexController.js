module.exports = function(bot,controller){
	// simple answer
	controller.hears(['help'], 'direct_message', function(bot, message){
	    bot.reply(message, 'help message');
    });

    // simple conversation
	controller.hears(['hi'], 'direct_message', function(bot, message){
		bot.startConversation(message, function(response, convo){
			convo.ask('hey there', function(response, convo){
				convo.say('..user typed any text after `hi`');
				convo.ask('heres a question', function(response, convo){
					convo.say('heres an answer');
					convo.next();
				})
				convo.next();
			})
		})
    });

};