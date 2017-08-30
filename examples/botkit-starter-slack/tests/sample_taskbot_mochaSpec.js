'use strict';
const assert = require('assert');
const Botmock = require('../../../lib/Botmock');
const fileBeingTested = require('../skills/sample_taskbot');

describe('sample_task_bot', function () {
	function generateTaskList (tasks) {
		
		var text = '';
		
		for (var t = 0; t < tasks.length; t++) {
			text = text + '> `' + (t + 1) + '`) ' + tasks[t] + '\n';
		}
		
		return text;
	}
	
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
	
	describe('say tasks', function () {
		beforeEach(function () {
			this.term = 'tasks';
			this.sequence = [
				{
					//type: null, //if type null, default to direct_message
					user: this.userInfo.slackId, //user required for each direct message
					channel: this.userInfo.channel, // user channel required for direct message
					messages: [
						{
							text: this.term,
							isAssertion: true,
						}
					]
				}
			];
		});
		
		describe('user does not exist in memory storage', function () {
			it('should return text There are no tasks on your list. Say `add _task_` to add something.', function () {
				return this.bot.usersInput(this.sequence).then((message) => {
					return assert.equal(
						message.text,
						'There are no tasks on your list. Say `add _task_` to add something.'
					);
				});
			});
		});
		
		describe('user exist in memory storage without tasks', function () {
			beforeEach(function (done) {
				this.controller.storage.users.save({
					id: this.userInfo.slackId,
					tasks: []
				}, function () { done(); });
			});
			
			it('should return text There are no tasks on your list. Say `add _task_` to add something.', function () {
				return this.bot.usersInput(this.sequence).then((message) => {
					return assert.equal(
						message.text,
						'There are no tasks on your list. Say `add _task_` to add something.'
					);
				});
			});
		});
		
		describe('user exist in memory storage with tasks', function () {
			beforeEach(function (done) {
				this.controller.storage.users.save({
					id: this.userInfo.slackId,
					tasks: ['new task']
				}, function () { done(); });
			});
			
			it('should return text with task list', function () {
				return this.bot.usersInput(this.sequence).then((message) => {
					var text = 'Here are your current tasks: \n' +
						generateTaskList(['new task']) +
						'Reply with `done _number_` to mark a task completed.';
					
					return assert.equal(
						message.text,
						text
					);
				});
			});
		});
	});
	
	describe('say todo', function () {
		beforeEach(function () {
			this.term = 'todo';
			this.sequence = [
				{
					//type: null, //if type null, default to direct_message
					user: this.userInfo.slackId, //user required for each direct message
					channel: this.userInfo.channel, // user channel required for direct message
					messages: [
						{
							text: this.term,
							isAssertion: true,
						}
					]
				}
			];
		});
		
		describe('user does not exist in memory storage', function () {
			it('should return text There are no tasks on your list. Say `add _task_` to add something.', function () {
				return this.bot.usersInput(this.sequence).then((message) => {
					return assert.equal(
						message.text,
						'There are no tasks on your list. Say `add _task_` to add something.'
					);
				});
			});
		});
		
		describe('user exist in memory storage without tasks', function () {
			beforeEach(function (done) {
				this.controller.storage.users.save({
					id: this.userInfo.slackId,
					tasks: []
				}, function () { done(); });
			});
			
			it('should return text There are no tasks on your list. Say `add _task_` to add something.', function () {
				return this.bot.usersInput(this.sequence).then((message) => {
					return assert.equal(
						message.text,
						'There are no tasks on your list. Say `add _task_` to add something.'
					);
				});
			});
		});
		
		describe('user exist in memory storage with tasks', function () {
			beforeEach(function (done) {
				this.controller.storage.users.save({
					id: this.userInfo.slackId,
					tasks: ['new task']
				}, function () { done(); });
			});
			
			it('should return text with task list', function () {
				return this.bot.usersInput(this.sequence).then((message) => {
					var text = 'Here are your current tasks: \n' +
						generateTaskList(['new task']) +
						'Reply with `done _number_` to mark a task completed.';
					
					return assert.equal(
						message.text,
						text
					);
				});
			});
		});
	});
	
	describe('say add (.*)', function () {
		['direct_message', 'direct_mention', 'mention'].forEach(function (eventType) {
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
									text: this.term,
									isAssertion: true,
								}
							]
						}
					];
				});
				
				describe('user does not exist in memory storage', function () {
					it('should add in api log reactions.add with name thumbsup', function () {
						return this.bot.usersInput(this.sequence).then(() => {
							return assert.equal(
								this.bot.api.logByKey['reactions.add'][0].name,
								'thumbsup'
							);
						});
					});
					
					it('should add in memory storage task entity', function (done) {
						return this.bot.usersInput(this.sequence).then((message) => {
							this.controller.storage.users.get(this.userInfo.slackId, function (err, user) {
								assert.equal(
									user.tasks[0],
									'new task'
								);
								done();
							});
						});
					});
				});
				
				describe('user exist in memory storage without tasks', function () {
					it('should add in api log reactions.add with name thumbsup', function () {
						return this.bot.usersInput(this.sequence).then(() => {
							return assert.equal(
								this.bot.api.logByKey['reactions.add'][0].name,
								'thumbsup'
							);
						});
					});
					
					it('should add in memory storage task entity', function (done) {
						return this.bot.usersInput(this.sequence).then((message) => {
							this.controller.storage.users.get(this.userInfo.slackId, function (err, user) {
								assert.equal(
									user.tasks[0],
									'new task'
								);
								done();
							});
						});
					});
				});
				
				describe('user exist in memory storage with tasks', function () {
					beforeEach(function (done) {
						this.controller.storage.users.save({
							id: this.userInfo.slackId,
							tasks: ['new task origin']
						}, function () { done(); });
					});
					
					it('should add in api log reactions.add with name thumbsup', function () {
						return this.bot.usersInput(this.sequence).then(() => {
							return assert.equal(
								this.bot.api.logByKey['reactions.add'][0].name,
								'thumbsup'
							);
						});
					});
					
					it('should add in memory storage task entity', function (done) {
						return this.bot.usersInput(this.sequence).then((message) => {
							this.controller.storage.users.get(this.userInfo.slackId, function (err, user) {
								assert.equal(
									user.tasks[0],
									'new task origin'
								);
								assert.equal(
									user.tasks[1],
									'new task'
								);
								done();
							});
						});
					});
				});
			});
		});
	});
	
	describe('done (.*)', function () {
		describe('no tasks in storage', function () {
			beforeEach(function (done) {
				this.controller.storage.users.save({
					id: this.userInfo.slackId,
					tasks: []
				}, function () { done(); });
			});
			
			describe('done number', function () {
				beforeEach(function () {
					this.term = 'done 1';
					this.sequence = [
						{
							//type: null, //if type null, default to direct_message
							user: this.userInfo.slackId, //user required for each direct message
							channel: this.userInfo.channel, // user channel required for direct message
							messages: [
								{
									text: this.term,
									isAssertion: true,
								}
							]
						}
					];
				});
				
				it('should return text Sorry, your input is out of range. Right now there are 0 items on your list.', function () {
					return this.bot.usersInput(this.sequence).then((message) => {
						return assert.equal(
							message.text,
							'Sorry, your input is out of range. Right now there are 0 items on your list.'
						);
					});
				});
			});
			
			describe('done some text', function () {
				beforeEach(function () {
					this.term = 'done some text';
					this.sequence = [
						{
							//type: null, //if type null, default to direct_message
							user: this.userInfo.slackId, //user required for each direct message
							channel: this.userInfo.channel, // user channel required for direct message
							messages: [
								{
									text: this.term,
									isAssertion: true,
								}
							]
						}
					];
				});
				
				it('should return text Please specify a number.', function () {
					return this.bot.usersInput(this.sequence).then((message) => {
						return assert.equal(
							message.text,
							'Please specify a number.'
						);
					});
				});
			});
			
		});
		
		describe('one task in storage', function () {
			beforeEach(function (done) {
				this.controller.storage.users.save({
					id: this.userInfo.slackId,
					tasks: ['first task']
				}, function () { done(); });
			});
			
			describe('done number', function () {
				describe('number not in range', function () {
					beforeEach(function () {
						this.term = 'done 2';
						this.sequence = [
							{
								//type: null, //if type null, default to direct_message
								user: this.userInfo.slackId, //user required for each direct message
								channel: this.userInfo.channel, // user channel required for direct message
								messages: [
									{
										text: this.term,
										isAssertion: true,
									}
								]
							}
						];
					});
					
					it('should return text Sorry, your input is out of range. Right now there are 1 items on your list.', function () {
						return this.bot.usersInput(this.sequence).then((message) => {
							return assert.equal(
								message.text,
								'Sorry, your input is out of range. Right now there are 1 items on your list.'
							);
						});
					});
				});
				
				describe('number in range', function () {
					beforeEach(function () {
						this.term = 'done 1';
						this.sequence = [
							{
								//type: null, //if type null, default to direct_message
								user: this.userInfo.slackId, //user required for each direct message
								channel: this.userInfo.channel, // user channel required for direct message
								messages: [
									{
										text: this.term,
										isAssertion: true,
									}
								]
							}
						];
					});
					
					it('should return text Your list is now empty!', function () {
						return this.bot.usersInput(this.sequence).then((message) => {
							return assert.equal(
								message.text,
								'Your list is now empty!'
							);
						});
					});
					
					it('should update tasks in storage: length 0', function (done) {
						return this.bot.usersInput(this.sequence).then((message) => {
							this.controller.storage.users.get(this.userInfo.slackId, function (err, user) {
								assert.equal(
									user.tasks.length,
									0
								);
								done();
							});
						});
					});
				});
			});
			
			describe('done some text', function () {
				beforeEach(function () {
					this.term = 'done some text';
					this.sequence = [
						{
							//type: null, //if type null, default to direct_message
							user: this.userInfo.slackId, //user required for each direct message
							channel: this.userInfo.channel, // user channel required for direct message
							messages: [
								{
									text: this.term,
									isAssertion: true,
								}
							]
						}
					];
				});
				
				it('should return text Please specify a number.', function () {
					return this.bot.usersInput(this.sequence).then((message) => {
						return assert.equal(
							message.text,
							'Please specify a number.'
						);
					});
				});
			});
			
		});
		
		describe('two task in storage', function () {
			beforeEach(function (done) {
				this.controller.storage.users.save({
					id: this.userInfo.slackId,
					tasks: ['first task', 'second task']
				}, function () { done(); });
			});
			
			describe('done number', function () {
				describe('number not in range', function () {
					beforeEach(function () {
						this.term = 'done 3';
						this.sequence = [
							{
								//type: null, //if type null, default to direct_message
								user: this.userInfo.slackId, //user required for each direct message
								channel: this.userInfo.channel, // user channel required for direct message
								messages: [
									{
										text: this.term,
										isAssertion: true,
									}
								]
							}
						];
					});
					
					it('should return text Sorry, your input is out of range. Right now there are 2 items on your list.', function () {
						return this.bot.usersInput(this.sequence).then((message) => {
							return assert.equal(
								message.text,
								'Sorry, your input is out of range. Right now there are 2 items on your list.'
							);
						});
					});
				});
				
				describe('number in range', function () {
					beforeEach(function () {
						this.term = 'done 2';
						this.sequence = [
							{
								//type: null, //if type null, default to direct_message
								user: this.userInfo.slackId, //user required for each direct message
								channel: this.userInfo.channel, // user channel required for direct message
								messages: [
									{
										text: this.term,
										isAssertion: true,
									}
								]
							}
						];
					});
					
					it('should return text Your list is now empty!', function () {
						return this.bot.usersInput(this.sequence).then((message) => {
							return assert.equal(
								message.text,
								'Here are our remaining tasks:\n' + generateTaskList(['first task'])
							);
						});
					});
					
					it('should update tasks in storage: length 1', function (done) {
						return this.bot.usersInput(this.sequence).then((message) => {
							this.controller.storage.users.get(this.userInfo.slackId, function (err, user) {
								assert.equal(
									user.tasks.length,
									1
								);
								done();
							});
						});
					});
				});
			});
			
			describe('done some text', function () {
				beforeEach(function () {
					this.term = 'done some text';
					this.sequence = [
						{
							//type: null, //if type null, default to direct_message
							user: this.userInfo.slackId, //user required for each direct message
							channel: this.userInfo.channel, // user channel required for direct message
							messages: [
								{
									text: this.term,
									isAssertion: true,
								}
							]
						}
					];
				});
				
				it('should return text Please specify a number.', function () {
					return this.bot.usersInput(this.sequence).then((message) => {
						return assert.equal(
							message.text,
							'Please specify a number.'
						);
					});
				});
			});
			
		});
	});
	
});