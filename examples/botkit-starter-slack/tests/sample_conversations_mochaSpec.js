'use strict';
const assert = require('assert');
const Botmock = require('../../../lib/Botmock');
const fileBeingTested = require('../skills/sample_conversations');

describe('sample_conversations', function () {
	afterEach(function () {
		this.controller.shutdown();
	});
	
	beforeEach(function () {
		this.userInfo = {
			slackId: 'user123',
			channel: 'channel123',
		};
		
		this.controller = Botmock({
			stats_optout: true,
			debug: false,
		});
		
		this.bot = this.controller.spawn({
			type: 'slack',
		});
		
		fileBeingTested(this.controller);
	});
	
	describe('color conversation', function () {
		['direct_message', 'direct_mention'].forEach(function (eventType) {
			before(function () {
				this.term = 'color';
				
				this.buildSequence = function (messages) {
					return [
						{
							type: eventType, //if type null, default to direct_message
							user: this.userInfo.slackId, //user required for each direct message
							channel: this.userInfo.channel, // user channel required for direct message
							messages: messages
						}
					];
				};
			});
			
			describe('say color', function () {
				it('should return text This is an example of using convo.ask with a single callback.', function () {
					var messages = [{
						text: this.term,
						deep: 1, // usually userInput return last messages. deep to specify return lastIndex - deep
						isAssertion: true,
					}];
					
					return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
						return assert.equal(
							message.text,
							'This is an example of using convo.ask with a single callback.'
						);
					});
				});
				
				it('should return question What is your favorite color?', function () {
					var messages = [{
						text: this.term,
						deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
						isAssertion: true,
					}];
					
					return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
						return assert.equal(
							message.text,
							'What is your favorite color?'
						);
					});
				});
				
				describe('say some text', function () {
					it('should return text Cool, I like some text too!', function () {
						var messages = [{
							text: this.term,
						}, {
							text: 'some text',
							isAssertion: true,
						}];
						
						return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
							return assert.equal(
								message.text,
								'Cool, I like some text too!'
							);
						});
					});
				});
			});
			
		});
	});
	
	describe('question conversation', function () {
		['direct_message', 'direct_mention'].forEach(function (eventType) {
			before(function () {
				this.term = 'question';
				
				this.buildSequence = function (messages) {
					return [
						{
							type: eventType, //if type null, default to direct_message
							user: this.userInfo.slackId, //user required for each direct message
							channel: this.userInfo.channel, // user channel required for direct message
							messages: messages
						}
					];
				};
			});
			
			describe('say question', function () {
				it('should return question Do you like cheese?', function () {
					var messages = [{
						text: this.term,
						deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
						isAssertion: true,
					}];
					
					return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
						return assert.equal(
							message.text,
							'Do you like cheese?'
						);
					});
				});
				
				describe('say yes', function () {
					it('should return text How wonderful.', function () {
						var messages = [{
							text: this.term,
						}, {
							text: 'yes',
							deep: 1, // usually userInput return last messages. deep to specify return lastIndex - deep
							isAssertion: true,
						}];
						
						return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
							return assert.equal(
								message.text,
								'How wonderful.'
							);
						});
					});
					
					it('should return text Let us eat some!', function () {
						var messages = [{
							text: this.term,
						}, {
							text: 'yes',
							deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
							isAssertion: true,
						}];
						
						return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
							return assert.equal(
								message.text,
								'Let us eat some!'
							);
						});
					});
				});
				
				describe('say no', function () {
					it('should return text Cheese! It is not for everyone.', function () {
						var messages = [{
							text: this.term,
						}, {
							text: 'no',
							deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
							isAssertion: true,
						}];
						
						return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
							return assert.equal(
								message.text,
								'Cheese! It is not for everyone.'
							);
						});
					});
				});
				
				describe('say some text', function () {
					it('should return text Sorry I did not understand. Say `yes` or `no`', function () {
						var messages = [{
							text: this.term,
						}, {
							text: 'some text',
							deep: 1, // usually userInput return last messages. deep to specify return lastIndex - deep
							isAssertion: true,
						}];
						
						return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
							return assert.equal(
								message.text,
								'Sorry I did not understand. Say `yes` or `no`'
							);
						});
					});
					
					it('should repeat text Do you like cheese?', function () {
						var messages = [{
							text: this.term,
						}, {
							text: 'some text',
							deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
							isAssertion: true,
						}];
						
						return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
							return assert.equal(
								message.text,
								'Do you like cheese?'
							);
						});
					});
					
					describe('say yes', function () {
						it('should return text How wonderful.', function () {
							var messages = [{
								text: this.term,
							}, {
								text: 'some text',
							}, {
								text: 'yes',
								deep: 1, // usually userInput return last messages. deep to specify return lastIndex - deep
								isAssertion: true,
							}];
							
							return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
								return assert.equal(
									message.text,
									'How wonderful.'
								);
							});
						});
						
						it('should return text Let us eat some!', function () {
							var messages = [{
								text: this.term,
							}, {
								text: 'some text',
							}, {
								text: 'yes',
								deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
								isAssertion: true,
							}];
							
							return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
								return assert.equal(
									message.text,
									'Let us eat some!'
								);
							});
						});
					});
					
					describe('say no', function () {
						it('should return text Cheese! It is not for everyone.', function () {
							var messages = [{
								text: this.term,
							}, {
								text: 'some text',
							}, {
								text: 'no',
								deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
								isAssertion: true,
							}];
							
							return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
								return assert.equal(
									message.text,
									'Cheese! It is not for everyone.'
								);
							});
						});
					});
					
					describe('say some text', function () {
						it('should return text Sorry I did not understand. Say `yes` or `no`', function () {
							var messages = [{
								text: this.term,
							}, {
								text: 'some text',
							}, {
								text: 'some text',
								deep: 1, // usually userInput return last messages. deep to specify return lastIndex - deep
								isAssertion: true,
							}];
							
							return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
								return assert.equal(
									message.text,
									'Sorry I did not understand. Say `yes` or `no`'
								);
							});
						});
						
						it('should repeat text Do you like cheese?', function () {
							var messages = [{
								text: this.term,
							}, {
								text: 'some text',
							}, {
								text: 'some text',
								deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
								isAssertion: true,
							}];
							
							return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
								return assert.equal(
									message.text,
									'Do you like cheese?'
								);
							});
						});
						
						describe('say yes', function () {
							it('should return text How wonderful.', function () {
								var messages = [{
									text: this.term,
								}, {
									text: 'some text',
								}, {
									text: 'some text',
								}, {
									text: 'yes',
									deep: 1, // usually userInput return last messages. deep to specify return lastIndex - deep
									isAssertion: true,
								}];
								
								return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
									return assert.equal(
										message.text,
										'How wonderful.'
									);
								});
							});
							
							it('should return text Let us eat some!', function () {
								var messages = [{
									text: this.term,
								}, {
									text: 'some text',
								}, {
									text: 'some text',
								}, {
									text: 'yes',
									deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
									isAssertion: true,
								}];
								
								return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
									return assert.equal(
										message.text,
										'Let us eat some!'
									);
								});
							});
						});
						
						describe('say no', function () {
							it('should return text Cheese! It is not for everyone.', function () {
								var messages = [{
									text: this.term,
								}, {
									text: 'some text',
								}, {
									text: 'some text',
								}, {
									text: 'no',
									deep: 0, // usually userInput return last messages. deep to specify return lastIndex - deep
									isAssertion: true,
								}];
								
								return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
									return assert.equal(
										message.text,
										'Cheese! It is not for everyone.'
									);
								});
							});
						});
					});
				});
			});
			
		});
	});
});
