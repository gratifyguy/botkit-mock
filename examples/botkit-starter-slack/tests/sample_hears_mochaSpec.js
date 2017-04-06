'use strict';
const assert = require('assert');
const Botmock = require('../../../lib/Botmock');
const fileBeingTested = require("../skills/sample_hears");

describe('sample_hears', function(){
    afterEach(function(){
        this.controller.shutdown();
    });

    beforeEach(function(){
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

    //difficult to catch uptime sec
    describe('uptime hears', function(){
        beforeEach(function(){
            this.term = 'uptime';
        });

        describe('as direct_message', function(){
            beforeEach(function(){
                this.sequence = [
                    {
                        //type: null, //if type null, default to direct_message
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages:[
                            {
                                text: this.term,
                                isAssertion:true,
                            }
                        ]
                    }
                ];
            });


            describe('without triggers and convos', function(){
                   it('should return message' +
                       '(My main process has been online for {{vars.uptime}}.' +
                       ' Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.)' +
                       'with ' +
                       'triggers: 0' +
                       'convos: 0', function(){

                       return this.bot.usersInput(this.sequence).then((message)=>{
                           return assert.equal(
                               message.text.indexOf(' Since booting, I have heard 0 triggers, and conducted 0 conversations.') > -1,
                               true
                           );
                       })
                   });
               });

            describe('with (1) trigger and (1) convo', function(){
                beforeEach(function(){
                    this.bot.receive({type: 'heard_trigger'});
                    this.bot.receive({type: 'conversationStarted'});
                });

                it('should return message' +
                   '(My main process has been online for {{vars.uptime}}.' +
                   ' Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.)' +
                   'with ' +
                   'triggers: 1' +
                   'convos: 1', function(){

                   return this.bot.usersInput(this.sequence).then((message)=>{
                       return assert.equal(
                           message.text.indexOf(' Since booting, I have heard 1 triggers, and conducted 1 conversations.') > -1,
                           true
                       );
                   })
                });
           });
        });

        describe('as direct_mention', function(){
            beforeEach(function(){
                this.sequence = [
                    {
                        type: 'direct_mention', //if type null, default to direct_message
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages:[
                            {
                                text: this.term,
                                isAssertion:true,
                            }
                        ]
                    }
                ];
            });


            describe('without triggers and convos', function(){
                   it('should return message' +
                       '(My main process has been online for {{vars.uptime}}.' +
                       ' Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.)' +
                       'with ' +
                       'triggers: 0' +
                       'convos: 0', function(){

                       return this.bot.usersInput(this.sequence).then((message)=>{
                           return assert.equal(
                               message.text.indexOf(' Since booting, I have heard 0 triggers, and conducted 0 conversations.') > -1,
                               true
                           );
                       })
                   });
               });

            describe('with (1) trigger and (1) convo', function(){
                   beforeEach(function(){
                      this.bot.receive({type: 'heard_trigger'});
                      this.bot.receive({type: 'conversationStarted'});
                   });

                   it('should return message' +
                       '(My main process has been online for {{vars.uptime}}.' +
                       ' Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.)' +
                       'with ' +
                       'triggers: 1' +
                       'convos: 1', function(){

                       return this.bot.usersInput(this.sequence).then((message)=>{
                           return assert.equal(
                               message.text.indexOf(' Since booting, I have heard 1 triggers, and conducted 1 conversations.') > -1,
                               true
                           );
                       })
                   });
               });
        });
    });

    //difficult to catch uptime sec
    describe('debug hears', function(){
        beforeEach(function(){
            this.term = 'debug';
        });

        describe('as direct_message', function(){
            beforeEach(function(){
                this.sequence = [
                    {
                        //type: null, //if type null, default to direct_message
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages:[
                            {
                                text: this.term,
                                isAssertion:true,
                            }
                        ]
                    }
                ];
            });


            describe('without triggers and convos', function(){
                   it('should return message' +
                       '(My main process has been online for {{vars.uptime}}.' +
                       ' Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.)' +
                       'with ' +
                       'triggers: 0' +
                       'convos: 0', function(){

                       return this.bot.usersInput(this.sequence).then((message)=>{
                           return assert.equal(
                               message.text.indexOf(' Since booting, I have heard 0 triggers, and conducted 0 conversations.') > -1,
                               true
                           );
                       })
                   });
               });

            describe('with (1) trigger and (1) convo', function(){
                beforeEach(function(){
                    this.bot.receive({type: 'heard_trigger'});
                    this.bot.receive({type: 'conversationStarted'});
                });

                it('should return message' +
                   '(My main process has been online for {{vars.uptime}}.' +
                   ' Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.)' +
                   'with ' +
                   'triggers: 1' +
                   'convos: 1', function(){

                   return this.bot.usersInput(this.sequence).then((message)=>{
                       return assert.equal(
                           message.text.indexOf(' Since booting, I have heard 1 triggers, and conducted 1 conversations.') > -1,
                           true
                       );
                   })
                });
           });
        });

        describe('as direct_mention', function(){
            beforeEach(function(){
                this.sequence = [
                    {
                        type: 'direct_mention', //if type null, default to direct_message
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages:[
                            {
                                text: this.term,
                                isAssertion:true,
                            }
                        ]
                    }
                ];
            });


            describe('without triggers and convos', function(){
                   it('should return message' +
                       '(My main process has been online for {{vars.uptime}}.' +
                       ' Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.)' +
                       'with ' +
                       'triggers: 0' +
                       'convos: 0', function(){

                       return this.bot.usersInput(this.sequence).then((message)=>{
                           return assert.equal(
                               message.text.indexOf(' Since booting, I have heard 0 triggers, and conducted 0 conversations.') > -1,
                               true
                           );
                       })
                   });
               });

            describe('with (1) trigger and (1) convo', function(){
                   beforeEach(function(){
                      this.bot.receive({type: 'heard_trigger'});
                      this.bot.receive({type: 'conversationStarted'});
                   });

                   it('should return message' +
                       '(My main process has been online for {{vars.uptime}}.' +
                       ' Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.)' +
                       'with ' +
                       'triggers: 1' +
                       'convos: 1', function(){

                       return this.bot.usersInput(this.sequence).then((message)=>{
                           return assert.equal(
                               message.text.indexOf(' Since booting, I have heard 1 triggers, and conducted 1 conversations.') > -1,
                               true
                           );
                       })
                   });
               });
        });
    });


    describe('say (.*) hears', function(){
        describe('without blacklisted text', function(){
            beforeEach(function(){
                this.term = 'say yo bro';
            });

            describe('as direct_message', function(){
                beforeEach(function(){
                    this.sequence = [
                        {
                            //type: null, //if type null, default to direct_message
                            user: this.userInfo.slackId, //user required for each direct message
                            channel: this.userInfo.channel, // user channel required for direct message
                            messages:[
                                {
                                    text: this.term,
                                    isAssertion:true,
                                }
                            ]
                        }
                    ];
                });


                describe('without triggers and convos', function(){
                    it('should return message yo bro', function(){

                        return this.bot.usersInput(this.sequence).then((message)=>{
                            return assert.equal(
                                message.text,
                                'yo bro'
                            );
                        })
                    });
                });
            });

            describe('as direct_mention', function(){
                beforeEach(function(){
                    this.sequence = [
                        {
                            type: 'direct_mention', //if type null, default to direct_message
                            user: this.userInfo.slackId, //user required for each direct message
                            channel: this.userInfo.channel, // user channel required for direct message
                            messages:[
                                {
                                    text: this.term,
                                    isAssertion:true,
                                }
                            ]
                        }
                    ];
                });


                describe('without triggers and convos', function(){
                    it('should return message yo bro', function(){

                        return this.bot.usersInput(this.sequence).then((message)=>{
                            return assert.equal(
                                message.text,
                                'yo bro'
                            );
                        })
                    });
                });
            });
        });

        describe('with blacklisted text', function(){
            beforeEach(function(){
                this.term = 'say beeyotch';
            });

            describe('as direct_message', function(){
                beforeEach(function(){
                    this.sequence = [
                        {
                            //type: null, //if type null, default to direct_message
                            user: this.userInfo.slackId, //user required for each direct message
                            channel: this.userInfo.channel, // user channel required for direct message
                            messages:[
                                {
                                    text: this.term,
                                    isAssertion:true,
                                }
                            ]
                        }
                    ];
                });


                describe('without triggers and convos', function(){
                    it('should return message (_sigh_)', function(){

                        return this.bot.usersInput(this.sequence).then((message)=>{
                            return assert.equal(
                                message.text,
                                '_sigh_'
                            );
                        })
                    });
                });
            });

            describe('as direct_mention', function(){
                beforeEach(function(){
                    this.sequence = [
                        {
                            type: 'direct_mention', //if type null, default to direct_message
                            user: this.userInfo.slackId, //user required for each direct message
                            channel: this.userInfo.channel, // user channel required for direct message
                            messages:[
                                {
                                    text: this.term,
                                    isAssertion:true,
                                }
                            ]
                        }
                    ];
                });


                describe('without triggers and convos', function(){
                    it('should return message _sigh_', function(){

                        return this.bot.usersInput(this.sequence).then((message)=>{
                            return assert.equal(
                                message.text,
                                '_sigh_'
                            );
                        })
                    });
                });
            });
        });
    });

    describe('say (.*) hears', function(){
        beforeEach(function(){
            this.term = 'say';
        });

        describe('as direct_message', function(){
            beforeEach(function(){
                this.sequence = [
                    {
                        //type: null, //if type null, default to direct_message
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages:[
                            {
                                text: this.term,
                                isAssertion:true,
                            }
                        ]
                    }
                ];
            });

            describe('without triggers and convos', function(){
                it('should return message yo bro', function(){

                    return this.bot.usersInput(this.sequence).then((message)=>{
                        return assert.equal(
                            message.text,
                            'I will repeat whatever you say.'
                        );
                    })
                });
            });
        });

        describe('as direct_mention', function(){
            beforeEach(function(){
                this.sequence = [
                    {
                        type: 'direct_mention', //if type null, default to direct_message
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages:[
                            {
                                text: this.term,
                                isAssertion:true,
                            }
                        ]
                    }
                ];
            });

            describe('without triggers and convos', function(){
                it('should return message yo bro', function(){

                    return this.bot.usersInput(this.sequence).then((message)=>{
                        return assert.equal(
                            message.text,
                            'I will repeat whatever you say.'
                        );
                    })
                });
            });
        });
    });

});