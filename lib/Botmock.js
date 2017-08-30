var async = require('async');
var Botkit = require('botkit');
var BotmockWorker = require('./BotmockWorker');

function Botmock (configuration) {
	// Create a core botkit bot
	var botmock = Botkit.core(configuration);
	
	//override default botkit startTicking
	botmock.startTicking = function () {
		if (!botmock.tickInterval) {
			// set up a once a second tick to process messages
			botmock.tickInterval = setInterval(function () {
				botmock.tick();
			}, 10);
		}
	};
	
	botmock.on('message_received', function (bot, message) {
		return botmock.trigger(message.type, [bot, message]);
	});
	
	botmock.defineBot(BotmockWorker);
	
	return botmock;
}

module.exports = Botmock;