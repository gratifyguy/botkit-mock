'use strict';
const assert = require('assert');
const Botmock = require('../../../lib/Botmock');
const fileBeingTested = require('../skills/sample_events');

describe('sample_events', function () {
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
	
	describe('join', function () {
		['user_channel_join', 'user_group_join',].forEach(function (eventType) {
			describe('as ' + eventType, function () {
				beforeEach(function () {
					this.term = 'add new task';
					this.sequence = [
						{
							type: eventType, //if type null, default to direct_message
							user: this.userInfo.slackId, //user required for each direct message
							channel: this.userInfo.channel, // user channel required for direct message
							messages: [
								{
									isAssertion: true,
								}
							]
						}
					];
				});
				
				it('should sende message Welcome, <@username>', function () {
					return this.bot.usersInput(this.sequence).then((message) => {
						return assert.equal(
							message.text,
							'Welcome, <@' + this.userInfo.slackId + '>'
						);
					});
				});
			});
		});
	});
});