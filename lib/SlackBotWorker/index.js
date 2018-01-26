function SlackBotWorker (bot, botkit, config) {
	var Storage = require('./apiStorage');
	bot.api = require('./api')(botkit, config || {}, new Storage());
	bot.identity = {
		id: null,
		name: '',
	};
	
	bot.startTyping = function (src) {
		bot.reply(src, {type: 'typing'});
	};
	
	bot.replyWithTyping = function (src, resp, cb) {
		var typingLength = 10;
		
		bot.startTyping(src);
		
		setTimeout(function () {
			bot.reply(src, resp, cb);
		}, typingLength);
	};

	bot.replyAndUpdate = function (src, resp, cb) {
		const selfSrc = src;

		bot.reply(src, resp, function(err, src) {
            return cb && cb(null, src, function (resp, cb) {
                bot.reply(selfSrc, resp);
            });
        });
	};
	
	bot.startConversation = function (message, cb) {
		botkit.startConversation(this, message, cb);
	};
	
	bot.replyInteractive = function (src, resp, cb) {
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
	};
	
	bot.replyPublic = function (src, resp, cb) {
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
		
		msg.response_type = 'in_channel';
		
		var requestOptions = {
			uri: src.response_url,
			method: 'POST',
			json: msg
		};
		bot.api.callAPI('replyPublic', requestOptions, function (err, resp, body) {
			/**
			 * Do something?
			 */
			if (err) {
				botkit.log.error('Error sending slash command response:', err);
				cb && cb(err);
			} else {
				cb && cb();
			}
		});
	};
	
	bot.replyPublicDelayed = bot.replyPublic;
	
	bot.replyPrivate = function (src, resp, cb) {
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
		
		msg.response_type = 'ephemeral';
		
		var requestOptions = {
			uri: src.response_url,
			method: 'POST',
			json: msg
		};
		bot.api.callAPI('replyPrivate', requestOptions, function (err, resp, body) {
			/**
			 * Do something?
			 */
			if (err) {
				botkit.log.error('Error sending slash command response:', err);
				cb && cb(err);
			} else {
				cb && cb();
			}
		});
	};
	
	bot.replyPrivateDelayed = bot.replyPrivate;

	bot.startConversationInThread = function (message, cb) {
		// make replies happen in a thread
		if (!message.thread_ts) {
			message.thread_ts = message.ts;
		}
		botkit.startConversation(this, message, cb);
	};
	
	bot.createConversation = function (message, cb) {
		botkit.createConversation(this, message, cb);
	};
	
	bot.createConversationInThread = function (message, cb) {
		// make replies happen in a thread
		if (!message.thread_ts) {
			message.thread_ts = message.ts;
		}
		botkit.createConversation(this, message, cb);
	};

	bot.replyInThread = function(src, resp, cb) {
		var msg = {};

		if (typeof(resp) == 'string') {
			msg.text = resp;
		} else {
			msg = resp;
		}

		msg.channel = src.channel;
		msg.to = src.user;

		// to create a thread, set the original message as the parent
		msg.thread_ts = src.thread_ts ? src.thread_ts : src.ts;

		bot.say(msg, cb);
	};
	
	bot.findConversation = function (message, cb) {
		botkit.debug('CUSTOM FIND CONVO', message.user, message.channel);
		for (var t = 0; t < botkit.tasks.length; t++) {
			for (var c = 0; c < botkit.tasks[t].convos.length; c++) {
				if (
					botkit.tasks[t].convos[c].isActive() &&
					botkit.tasks[t].convos[c].source_message.user == message.user &&
					botkit.tasks[t].convos[c].source_message.channel == message.channel &&
					botkit.tasks[t].convos[c].source_message.thread_ts == message.thread_ts
				) {
					botkit.debug('FOUND EXISTING CONVO!');
					
					// modify message text to prune off the bot's name (@bot hey -> hey)
					// and trim whitespace that is sometimes added
					// this would otherwise happen in the handleSlackEvents function
					// which does not get called for messages attached to conversations.
					
					if (message.text) {
						message.text = message.text.trim();
						
						var direct_mention = new RegExp('^\<\@' + bot.identity.id + '\>', 'i');
						
						message.text = (message.text || '').replace(direct_mention, '')
							.replace(/^\s+/, '').replace(/^\:\s+/, '').replace(/^\s+/, '');
					}
					
					cb(botkit.tasks[t].convos[c]);
					return;
				}
			}
		}
		
		cb();
	};
}

module.exports = SlackBotWorker;
