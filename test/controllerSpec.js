'use strict';
const assert = require('assert');
const botMock = require('../mocks/botMock');
const testedFile = require("../bot/indexController");

describe("controller tests",()=>{
	beforeEach((done)=>{
        var self = this;
        self.slackId = 'test'
        self.user_name = 'test'
        self.controller =new botMock.controller(self.slackId,self.user_name)
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
                assert.equal(text, 'help message')
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
                assert.equal(text, 'hey there')
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
                assert.equal(text, 'heres a question')
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
                console.log('textt =>', text)
                assert.equal(text, '..user typed any text after `hi`')
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
                assert.equal(text, 'heres an answer')
                done()
            })
    });
});