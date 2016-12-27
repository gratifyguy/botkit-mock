'use strict';
const assert = require('assert');
const botMock = require('../mocks/botMock');
const testedFile = require("../bot/indexController");

describe("controller tests",()=>{
	beforeEach((done)=>{
        var self = this;
        self.slackId = 'test'
        self.userName = 'test'
        self.controller =new botMock.controller(self.slackId,self.userName)
        testedFile(self.controller.bot,self.controller)
        done();
    });

    it('should return `help message` if user types `help`', (done)=>{
		var self = this;
		return self.controller.usersInput([{
                first:true,
                user: self.slackId,
                messages:[{text: 'help', isAssertion:true}]
            }]).then((text)=>{
                console.log('text =>', text)
                expect(text).toBe('help message');
                done()
            })
    });

    it('should return `hey there` if a user types `hi`', (done)=>{
		var self = this;
		return self.controller.usersInput([{
                first:true,
                user: self.slackId,
                messages:[{text: 'hi', isAssertion:true}]
            }]).then((text)=>{
                console.log('text =>', text)
                expect(text).toBe('hey there');
                done()
            })
    });

    it('should return question `heres a question` if user type any text after `hi`', (done)=>{
		var self = this;
		return self.controller.usersInput([{
                first:true,
                user: self.slackId,
                messages:[{text: 'hi'}, {text: 'its true', isAssertion:true}]
            }]).then((text)=>{
                console.log('text =>', text)
                expect(text).toBe('heres a question');
                done()
            })
    });

    it('should return `..user typed any text after `hi`` if user types any text after `hi`', (done)=>{
		var self = this;
		return self.controller.usersInput([{
                first:true,
                user: self.slackId,
                // deep indicates which message to return in then .then()
                // ie deep: 1, text => its true. deep:2, text => hi
                messages:[{text: 'hi'}, {text: 'its true', isAssertion:true, deep: 1}]
            }]).then((text)=>{
                console.log('textt =>', text);
                expect(text).toBe('..user typed any text after `hi`');
                done()
            })
    });

    it('should return `heres a question` if user type any text after bot says `..user typed any text after `hi``', (done)=>{
		var self = this;
		return self.controller.usersInput([{
                first:true,
                user: self.slackId,
                messages:[{text: 'hi'}, {text: 'random user message 1'}, {text: 'random user message 2', isAssertion:true, }]
            }]).then((text)=>{
                console.log('text =>', text)
                expect(text).toBe('heres an answer');
                done()
            })
    });

    it('should return `hello bot reply` (through bot.reply) in channel if user types `hello bot` in channel', (done)=>{
        var self = this;
        return self.controller.usersInput([{
            first: true,
            user: self.slackId,
            messages:[{channel: "newbies", text: 'hello bot reply', isAssertion: true}]
        }]).then((text)=>{
            console.log('text =>', self.controller.bot.detailedAnswers["newbies"][0]);
            expect(self.controller.bot.detailedAnswers["newbies"][0]).toBe('hello bot reply');
            done()
        })
    });

    it('should return `hello bot say` (through bot.say) in channel if user types `hello bot` in channel', (done)=>{
        var self = this;
        return self.controller.usersInput([{
            first: true,
            user: self.slackId,
            messages:[{channel: "newbies", text: 'hello bot say', isAssertion: true}]
        }]).then((text)=>{
            console.log('text =>', self.controller.bot.detailedAnswers["newbies"][0]);
            expect(self.controller.bot.detailedAnswers["newbies"][0]).toBe('hello bot say');
            done()
        })
    });
});
