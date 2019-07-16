module.exports = function (controller) {
	controller.on('slash_command', async function (bot, message) {
		switch (message.command) {
			case '/public':
				await bot.replyPublic(message, 'This is a public reply to the ' + message.command + ' slash command!');
				break;
			case '/private':
				await bot.replyPrivate(message, 'This is a private reply to the ' + message.command + ' slash command!');
				break;
			case '/private_long_running':
				await new Promise((r)=> setTimeout(r, 200));
				await bot.reply(message, 'Timeout reply');
				break;
		}
	});
};
