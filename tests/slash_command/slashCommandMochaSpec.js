'use strict';
const assert = require('assert');
const Botmock = require('../../lib/Botmock');
const fileBeingTested = require('./slashCommand');

describe('slash command tests', () => {
	afterEach(() => {
		//clean up botkit tick interval
		this.controller.shutdown();
	});
	
	beforeEach((done) => {
		this.userInfo = {
			slackId: 'user123',
			channel: 'channel123',
		};
		
		this.sequence = [
			{
				type: 'slash_command',
				user: this.userInfo.slackId, //user required for each direct message
				channel: this.userInfo.channel, // user channel required for direct message
				messages: [
					{
						text: 'text',
						isAssertion: true,
						command: '',
						//response_url : 'https://hooks.slack.com/commands/foo/bar'
					}
				]
			}
		];
		this.controller = Botmock({
			debug: false,
			log: false,
		});
		
		this.bot = this.controller.spawn({
			type: 'slack',
		});
		
		fileBeingTested(this.controller);
		done();
	});
	
	describe('replyPublic()', () => {
		it('should store reply message in bot.api.logByKey[\'replyPublic\']', () => {
			this.sequence[0].messages[0].command = '/public';
			
			return this.bot.usersInput(this.sequence).then(() => {
				const reply = this.bot.api.logByKey['replyPublic'][0].json;
				assert.equal(reply.text, 'This is a public reply to the /public slash command!');
				assert.equal(reply.response_type, 'in_channel', 'should be public message');
			}).catch((err) => { console.error(err); });
		});
	});
	
	describe('replyPrivate()', () => {
		it('should store reply message in bot.api.logByKey[\'replyPrivate\']', () => {
			this.sequence[0].messages[0].command = '/private';
			
			return this.bot.usersInput(this.sequence).then(() => {
				const reply = this.bot.api.logByKey['replyPrivate'][0].json;
				assert.equal(reply.text, 'This is a private reply to the /private slash command!');
				assert.equal(reply.response_type, 'ephemeral', 'should be private message');
			}).catch((err) => { console.error(err); });
		});
	});
	
	describe('replyPublicDelayed()', () => {
		it('should store reply message in bot.api.logByKey[\'replyPublic\']', () => {
			this.sequence[0].messages[0].command = '/public_delayed';
			
			return this.bot.usersInput(this.sequence).then(() => {
				const reply = this.bot.api.logByKey['replyPublic'][0].json;
				assert.equal(reply.text, 'This is a public reply to the /public_delayed slash command!');
				assert.equal(reply.response_type, 'in_channel', 'should be public message');
			}).catch((err) => { console.error(err); });
		});
	});
	
	describe('replyPrivateDelayed()', () => {
		it('should store reply message in bot.api.logByKey[\'replyPrivate\']', () => {
			this.sequence[0].messages[0].command = '/private_delayed';
			
			return this.bot.usersInput(this.sequence).then(() => {
				const reply = this.bot.api.logByKey['replyPrivate'][0].json;
				assert.equal(reply.text, 'This is a private reply to the /private_delayed slash command!');
				assert.equal(reply.response_type, 'ephemeral', 'should be private message');
			}).catch((err) => { console.error(err); });
		});
	});
});

