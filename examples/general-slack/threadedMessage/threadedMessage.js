module.exports = function(controller) {
	controller.hears('create_service', 'message', async(bot, message) => {
		await bot.startConversationInThread(message.channel, message.user, message.incoming_message.channelData.ts);
		await bot.say('Howdy!');
	});
};