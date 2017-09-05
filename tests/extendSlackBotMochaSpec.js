'use strict';
var Botmock = require('../lib/Botmock');
var assert = require('assert');

describe('extendSlackBot', () => {
	describe('add custom reply', function () {
		beforeEach(() => {
			this.controller = Botmock({
				debug: false,
			});

			function botExtender (bot, botkit, config) {
				bot.customReply = function (message, text) {
					bot.reply(message, 'Something new... ' + text);
				};
			}

			this.bot = this.controller.spawn({type: 'slack', botExtender: botExtender});
		});

		it('should add messages to detailed answer with appended "custom" word', () => {
			this.userMessage = {
				user: 'some user id',
				channel: 'some channel'
			};
			this.bot.customReply(this.userMessage, 'hello');
			assert.equal(this.bot.detailed_answers[this.userMessage.channel][0].text, 'Something new... hello');
		});
	});
	describe('support replyAndUpdate', () => {
        beforeEach(() => {
            this.controller = Botmock({
                debug: false,
            });

            this.bot = this.controller.spawn({type: 'slack'});
        });

        it('should log the updated message to replies as well', () => {
                this.userMessage = {
                	user: 'some user id',
					channel: 'some channel'
				};
                this.bot.replyAndUpdate(this.userMessage, 'hello', (err, src, updateResponse) => {
                	updateResponse('changed', (err) => {
                		if (err) fail(this, err);
                    });

                    assert.equal(this.bot.detailed_answers[this.userMessage.channel][0].text, 'hello');
                    assert.equal(this.bot.detailed_answers[this.userMessage.channel][1].text, 'changed');
                });
        });

    });
});