const {BotkitConversation} = require('botkit');
const MY_DIALOG_ID = 'my-dialog-name-constant';

function createServiceDialog(controller) {
	const MY_DIALOG_ID = 'my-dialog-name-constant';
	let convo = new BotkitConversation(MY_DIALOG_ID, controller);

	convo.say('Howdy!');
	return (convo);
}

module.exports = function(controller) {
	controller.addDialog(createServiceDialog(controller));

	controller.hears('create_dialog_service', 'message', async(bot, message) => {
		await bot.startConversationInThread(message.channel, message.user, message.incoming_message.channelData.ts);
		await bot.beginDialog(MY_DIALOG_ID);
	});
};