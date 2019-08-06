'use strict';
const assert = require('assert');
const {BotMock, SlackApiMock} = require('../../../lib');

const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack/lib/index');
const fileBeingTested = require('./slashCommand');

describe('slash command general-slack', () => {
    beforeEach(() => {
        this.userInfo = {
            slackId: 'user123',
            channel: 'channel123',
        };

        this.response_url = 'https://hooks.slack.com/commands/foo/bar';

        this.sequence = [
            {
                type: 'slash_command',
                user: this.userInfo.slackId, //user required for each direct message
                channel: this.userInfo.channel, // user channel required for direct message
                messages: [
                    {
                        text: 'text',
                        isAssertion: true,
                        command: '',
                        response_url: this.response_url
                    }
                ]
            }
        ];
        const adapter = new SlackAdapter({
            clientSigningSecret: "some secret",
            botToken: "some token",
            debug: true
        });

        adapter.use(new SlackEventMiddleware());
        adapter.use(new SlackMessageTypeMiddleware());

        this.controller = new BotMock({
            adapter: adapter,
            disable_webserver: true
        });

        SlackApiMock.bindMockApi(this.controller);

        fileBeingTested(this.controller);
    });

    describe('replyPublic()', () => {
        it('should store reply message in bot.api.logByKey[\'replyPublic\']', async () => {
            this.sequence[0].messages[0].command = '/public';
            await this.controller.usersInput(this.sequence);
            const reply = this.controller.apiLogByKey[this.response_url][0];
            assert.strictEqual(reply.text, 'This is a public reply to the /public slash command!');
            assert.strictEqual(reply.channelData.response_type, 'in_channel', 'should be public message');
        });
    });

    describe('replyPrivate()', () => {
        it('should store reply message in bot.api.logByKey[\'replyPrivate\']', async () => {
            this.sequence[0].messages[0].command = '/private';
            await this.controller.usersInput(this.sequence);
            const reply = this.controller.apiLogByKey[this.response_url][0];
            assert.strictEqual(reply.text, 'This is a private reply to the /private slash command!');
            assert.strictEqual(reply.channelData.response_type, 'ephemeral', 'should be private message');
        });
    });

    describe('reply with timeout', () => {
        it('should wait for the command result given a timout', async () => {
            this.sequence[0].messages[0].command = '/private_long_running';
            this.sequence[0].messages[0].waitAfter = 300;

            const msg = await this.controller.usersInput(this.sequence);
            assert.strictEqual(msg.text, 'Timeout reply');
        });
    });
});

