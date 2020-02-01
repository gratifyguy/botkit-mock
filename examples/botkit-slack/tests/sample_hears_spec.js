'use strict';
const assert = require('assert');
const {BotMock, SlackApiMock} = require('../../../lib');

const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack');
const fileBeingTested = require('../features/sample_hears');

describe('sample_hears file general-slack', () => {
    beforeEach(() => {
        this.userInfo = {
            slackId: 'user123',
            channel: 'channel123',
        };

        const adapter = new SlackAdapter(SlackApiMock.slackAdapterMockParams);

        adapter.use(new SlackEventMiddleware());
        adapter.use(new SlackMessageTypeMiddleware());

        this.controller = new BotMock({
            adapter: adapter,
        });

        SlackApiMock.bindMockApi(this.controller);

        fileBeingTested(this.controller);
    });

    describe('on hears event', () => {
        it(`should reply "I heard "foo" via a function test"`, async () => {
            const reply = await this.controller.usersInput([
                {
                    type: 'message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'foo',
                            isAssertion: true,
                        }
                    ]
                }
            ])

            assert.strictEqual(reply.text, `I heard "foo" via a function test`);
        });

        describe('number pattern', ()=>{
            it(`should reply "I heard a number using a regular expression." through message event`, async () => {
                const reply = await this.controller.usersInput([
                    {
                        type: 'message',
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages: [
                            {
                                text: '10',
                                isAssertion: true,
                            }
                        ]
                    }
                ])

                assert.strictEqual(reply.text, `I heard a number using a regular expression.`);
            });

            it(`should reply "I heard a number using a regular expression." through direct_message event`, async () => {
                const reply = await this.controller.usersInput([
                    {
                        type: 'direct_message',
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages: [
                            {
                                text: '10',
                                isAssertion: true,
                            }
                        ]
                    }
                ])

                assert.strictEqual(reply.text, `I heard a number using a regular expression.`);
            });
        });

        describe('allcaps', ()=>{
            it(`should reply "I HEARD ALL CAPS!" through message event`, async () => {
                const reply = await this.controller.usersInput([
                    {
                        type: 'message',
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages: [
                            {
                                text: 'ALLCAPS',
                                isAssertion: true,
                            }
                        ]
                    }
                ]);

                assert.strictEqual(reply.text, `I HEARD ALL CAPS!`);
            });

            it(`should reply "I HEARD ALL CAPS!" through direct_message event`, async () => {
                const reply = await this.controller.usersInput([
                    {
                        type: 'direct_message',
                        user: this.userInfo.slackId, //user required for each direct message
                        channel: this.userInfo.channel, // user channel required for direct message
                        messages: [
                            {
                                text: 'ALLCAPS',
                                isAssertion: true,
                            }
                        ]
                    }
                ]);

                assert.strictEqual(reply.text, `I HEARD ALL CAPS!`);
            });
        });


    });
});

