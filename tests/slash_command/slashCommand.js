module.exports = function (controller) {
	controller.on('slash_command', function (bot, message) {
		switch (message.command) {
			case '/public':
				bot.replyPublic(message, 'This is a public reply to the ' + message.command + ' slash command!');
				break;
			case '/private':
				bot.replyPrivate(message, 'This is a private reply to the ' + message.command + ' slash command!');
				break;
			case '/public_delayed':
				bot.replyPublicDelayed(message, 'This is a public reply to the ' + message.command + ' slash command!');
				break;
			case '/private_delayed':
				bot.replyPrivateDelayed(message, 'This is a private reply to the ' + message.command + ' slash command!');
				break;
		}
	});
};
