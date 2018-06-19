var async = require('async');
var SlackBotWorker = require('./SlackBotWorker');
var FacebookBotWorker = require('./FacebookBotWorker');

function defaultExtender (bot, botkit, config) {
	// extending...
}

function BotmockWorker (botkit, config) {
	if(!config){
		config = {};
	}
	if(!config.beforeProcessingUserMessageTimeout){
		config.beforeProcessingUserMessageTimeout = 100;
	}
	if(!config.afterProcessingUserMessageTimeout){
		config.afterProcessingUserMessageTimeout = 100;
	}
	
	var bot = {
		type: config.type,
		botkit: botkit,
		config: config,
		utterances: botkit.utterances,
		detailed_answers: {},
		answers: []
	};
	
	// region general methods for most bots
	bot.startConversation = function (message, cb) {
		botkit.startConversation(this, message, (a, b) => {
			cb(null, b);
		});
	};
	
	bot.reply = function (src, resp, cb) {
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
		bot.say(msg, cb);
	};
	
	bot.findConversation = function (message, cb) {
		botkit.debug('CUSTOM FIND CONVO', message.user, message.channel);
		for (var t = 0; t < botkit.tasks.length; t++) {
			for (var c = 0; c < botkit.tasks[t].convos.length; c++) {
				if (
					botkit.tasks[t].convos[c].isActive() &&
					botkit.tasks[t].convos[c].source_message.user == message.user
				) {
					botkit.debug('FOUND EXISTING CONVO!');
					cb(botkit.tasks[t].convos[c]);
					return;
				}
			}
		}
		
		cb();
	};
	
	bot.send = function (message, cb) {
		botkit.log.debug('BOT ANSWER', message);
		
		if (Array.isArray(bot.detailed_answers[message.channel])) {
			bot.detailed_answers[message.channel].push(message);
		} else {
			bot.detailed_answers[message.channel] = [message];
		}
		bot.answers.push(message);
		
		cb && cb(null, {ts: new Date().getTime()});
	};
	// endregion
	
	bot.usersInput = function (sequence) {
		var questions = [];
		
		sequence.forEach(function (userMessage) {
			userMessage.messages.forEach(function (message) {
				questions.push(function (cb) {
					var logic = function () {
						message.channel = message.channel || userMessage.channel;
						message.user = message.user || userMessage.user;
						message.type = (message.type || userMessage.type || 'direct_message');
						
						bot.receive(message);
						
						setTimeout(function () {
							if (message.isAssertion) {
								cb({payload: {isAssertion: true, deep: message.deep, channel: message.channel}});
							} else {
								cb(null);
							}
						}, message.timeout || config.afterProcessingUserMessageTimeout);
					};
					
					//add default timeout for async workflow
					setTimeout(logic, 0 || config.beforeProcessingUserMessageTimeout);
				});
			});
		});
		
		botkit.startTicking();
		
		return new Promise(function (resolve) {
			async.series(questions, function (err) {
				var payload = err.payload;
				if (!payload) {
					throw new Error();
				}
				if (payload.isAssertion) {
					var entity = bot.detailed_answers[payload.channel];
					var result = {};
					if (entity) {
						var index = bot.detailed_answers[payload.channel].length - 1 - (payload.deep || 0);
						result = bot.detailed_answers[payload.channel][index];
					}
					resolve(result);
				}
			});
		});
	};
	
	bot.receive = function (message) {
		botkit.debug('USER INPUT', message);
		message._pipeline = {};
		return botkit.receiveMessage(bot, message);
	};
	
	if (config.type === 'slack') {
		SlackBotWorker(bot, botkit, config);
	} else if (config.type === 'facebook') {
		FacebookBotWorker(bot, botkit, config);
	}
	
	var extender = config.botExtender;
	if (!extender || typeof extender !== 'function') {
		extender = defaultExtender;
	}
	
	extender(bot, botkit, config);
	
	return bot;
}

module.exports = BotmockWorker;
