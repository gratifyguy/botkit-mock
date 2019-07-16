'use strict';
const assert = require('assert');
const {BotMock, SlackApiMock} = require('../../../lib');

const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack');
const fileBeingTested = require('../features/sample_echo');

describe('sample_echo file general-slack', () => {
    beforeEach(() => {
        this.userInfo = {
            slackId: 'user123',
            channel: 'channel123',
        };

        const adapter = new SlackAdapter({
            clientSigningSecret: "some secret",
            botToken: "some token",
            debug: true
        });

        adapter.use(new SlackEventMiddleware());
        adapter.use(new SlackMessageTypeMiddleware());

        this.controller = new BotMock({
            adapter: adapter,
        });

        SlackApiMock.bindMockApi(this.controller);

        fileBeingTested(this.controller);
    });

    describe('on hears event', () => {
        it(`should reply "I heard a sample message."`, async () => {
            const reply = await this.controller.usersInput([
                {
                    type: 'message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'sample',
                            isAssertion: true,
                        }
                    ]
                }
            ])

            assert.strictEqual(reply.text, 'I heard a sample message.');
        });
    });

    describe('on message event', () => {
        it(`should reply "Echo: some text"`, async () => {
            const text = 'i wanna try echo functionality';
            const reply = await this.controller.usersInput([
                {
                    type: 'message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: text,
                            isAssertion: true,
                        }
                    ]
                }
            ]);

            assert.strictEqual(reply.text, `Echo: ${text}`);
        });
    });
});

