'use strict';
const assert = require('assert');
const botMock = require('../mocks/botMock');
const testedFile = require("../bot/indexController");

describe("test suite 1",()=>{
	beforeEach((done)=>{
        var self = this;
        self.slackId = 'test'
        self.user_name = 'test'
        self.controller =new botMock.controller(self.slackId,self.user_name)
        testedFile(self.controller.bot,self.controller)
        done();
    });

    it('should return `Mock help mesasge.` if user type `help`', (done)=>{
		var self = this;
		return self.controller.usersInput([{
                first:true,
                user: self.slackId,
                messages:[{text: 'help', isAssertion:true}]
            }]).then((text)=>{
                console.log('text =>', text)
                assert.equal(text, 'Mock help mesasge.')
                done()
            })
    });

    it('should return `hey there` if user type `hi`', (done)=>{
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

    it('should return question `hey 2 mock` if user type any text after `hi`', (done)=>{
		var self = this;
		return self.controller.usersInput([{
                first:true,
                user: self.slackId,
                messages:[{text: 'hi'}, {text: 'its true', isAssertion:true}]
            }]).then((text)=>{
                console.log('text =>', text)
                assert.equal(text, 'hey 2 mock')
                done()
            })
    });

    it('should return `hi mock` if user type any text after `hi`', (done)=>{
		var self = this;
		return self.controller.usersInput([{
                first:true,
                user: self.slackId,
                messages:[{text: 'hi'}, {text: 'its true', isAssertion:true, deep: 1}]
            }]).then((text)=>{
                console.log('text =>', text)
                assert.equal(text, 'hi mock')
                done()
            })
    });

    it('should return `hey 2 mock` if user type any text after `hey 2 mock`', (done)=>{
		var self = this;
		return self.controller.usersInput([{
                first:true,
                user: self.slackId,
                messages:[{text: 'hi'}, {text: 'its true'}, {text: 'its true true', isAssertion:true, }]
            }]).then((text)=>{
                console.log('text =>', text)
                assert.equal(text, 'hey 2 mock')
                done()
            })
    });
});