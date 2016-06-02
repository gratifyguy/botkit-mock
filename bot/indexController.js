module.exports = function(bot,controller){
	// simple answer
	controller.hears(['help'], 'direct_message', function(bot, message){
	    bot.reply(message, 'Mock help mesasge.');
    });

    // simple conversation
	controller.hears(['hi'], 'direct_message', function(bot, message){
		bot.startConversation(message, function(response, convo){
			convo.ask('hey there', function(response, convo){
				convo.say('hi mock');
				convo.ask('hey 2 mock', function(response, convo){
					convo.say('hey 2 mock');
					convo.next();
				})
				convo.next();
			})
		})
    });

};