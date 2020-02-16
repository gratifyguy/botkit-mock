'use strict';
const assert = require('assert');
const {BotMock, SlackApiMock} = require('../../../lib');
const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack');
const fileBeingTested = require('../features/slack_features');

async function setTimeoutAsync(timeout = 100) {
    return new Promise((r) => setTimeout(r, timeout));
}

describe('slack_features file general-slack', () => {
    const initController = () => {
        const adapter = new SlackAdapter(SlackApiMock.slackAdapterMockParams);
        adapter.use(new SlackEventMiddleware());
        adapter.use(new SlackMessageTypeMiddleware());

        this.controller = new BotMock({
            adapter: adapter,
        });

        SlackApiMock.bindMockApi(this.controller);

        fileBeingTested(this.controller);
    };

    beforeEach(() => {
        this.userInfo = {
            slackId: 'user123',
            channel: 'channel123',
        };
    });

    describe('controller.ready', () => {
        beforeEach(() => {
            process.env.MYTEAM = {};
            process.env.MYCHAN = 'my channel';
            process.env.MYUSER = 'my user';

            initController();
        });

        it(`should reply to my team channel "I AM AWOKEN."`, async () => {
            await setTimeoutAsync(1000);
            assert.deepStrictEqual(this.controller.detailed_answers[process.env.MYCHAN][0].text, 'I AM AWOKEN.');
            assert.deepStrictEqual(this.controller.detailed_answers[process.env.MYCHAN][0].conversation.id, process.env.MYCHAN);
        });
    });

    describe('on direct_message', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply "I heard a private message"`, async () => {
            const reply = await this.controller.usersInput([
                {
                    type: 'direct_message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'foo',
                            isAssertion: true,
                        }
                    ]
                }
            ]);

            assert.strictEqual(reply.text, `I heard a private message`);
        });
    });

    describe('on dm me', () => {
        beforeEach(() => {
            initController();
            this.userPrivateChannel = 'userPrivateChannel';
            this.controller.axiosMockAdapter.onPost('im.open').reply(200, {
                ok: true,
                channel: {id: this.userPrivateChannel}
            });
        });
        it(`should reply "Let's talk in private." in private channel`, async () => {
            await this.controller.usersInput([
                {
                    type: 'message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'dm me',
                            isAssertion: true,
                        }
                    ]
                }
            ]);
            assert.deepStrictEqual(this.controller.detailed_answers[this.userPrivateChannel][0].text, 'Let\'s talk in private.');
        });
    });

    describe('on direct_mention', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply "I heard a direct mention that said some"`, async () => {
            const text = 'fee bar';
            const reply = await this.controller.usersInput([
                {
                    type: 'direct_mention',
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

            assert.strictEqual(reply.text, `I heard a direct mention that said "${text}"`);
        });
    });

    describe('on mention', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply "I heard a direct mention that said some"`, async () => {
            const text = 'fee bar';
            const reply = await this.controller.usersInput([
                {
                    type: 'mention',
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

            assert.strictEqual(reply.text, `You mentioned me when you said "${text}"`);
        });
    });

    describe('ephemeral', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply "This is an ephemeral reply sent using bot.replyEphemeral()!" through message`, async () => {
            const reply = await this.controller.usersInput([
                {
                    type: 'message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'ephemeral',
                            isAssertion: true,
                        }
                    ]
                }
            ]);


            assert.strictEqual(reply.text, `This is an ephemeral reply sent using bot.replyEphemeral()!`);
        });

        it(`should reply "This is an ephemeral reply sent using bot.replyEphemeral()!" through direct_message`, async () => {
            const reply = await this.controller.usersInput([
                {
                    type: 'direct_message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'ephemeral',
                            isAssertion: true,
                        }
                    ]
                }
            ]);

            assert.strictEqual(reply.text, `This is an ephemeral reply sent using bot.replyEphemeral()!`);
        });
    });

    describe('threaded', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply in a correct sequence through message`, async () => {
            await this.controller.usersInput([
                {
                    type: 'message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'threaded',
                            isAssertion: true,
                        }
                    ]
                }
            ]);

            assert.strictEqual(this.controller.detailed_answers[this.userInfo.channel][0].text, `This is a reply in a thread!`);
            assert.strictEqual(this.controller.detailed_answers[this.userInfo.channel][1].text, `And this should also be in that thread!`);
        });

        it(`should reply in a correct sequence through direct_message`, async () => {
            await this.controller.usersInput([
                {
                    type: 'direct_message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'threaded',
                            isAssertion: true,
                        }
                    ]
                }
            ]);

            assert.strictEqual(this.controller.detailed_answers[this.userInfo.channel][0].text, `This is a reply in a thread!`);
            assert.strictEqual(this.controller.detailed_answers[this.userInfo.channel][1].text, `And this should also be in that thread!`);
        });
    });

    describe('blocks', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply with block object`, async () => {
            const text = 'blocks';
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

            assert.deepStrictEqual({blocks: reply.channelData.blocks}, {
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'd like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here"
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
                            "alt_text": "alt text for image"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft."
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg",
                            "alt_text": "alt text for image"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder."
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg",
                            "alt_text": "alt text for image"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Farmhouse",
                                    "emoji": true
                                },
                                "value": "Farmhouse"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Kin Khao",
                                    "emoji": true
                                },
                                "value": "Kin Khao"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Ler Ros",
                                    "emoji": true
                                },
                                "value": "Ler Ros"
                            }
                        ]
                    }
                ]
            });
        });
    });

    describe('block_actions', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply with block object`, async () => {
            const answer = 'test answer';
            const reply = await this.controller.usersInput([
                {
                    type: 'block_actions',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            isAssertion: true,
                            actions: [
                                {
                                    value: answer
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.strictEqual(reply.text, `Sounds like your choice is ${answer}`);
        });
    });

    describe('slash_command', () => {
        beforeEach(() => {
            initController();
        });

        it(`should reply "This is a plain reply" on plain`, async () => {
            const text = 'plain';
            const reply = await this.controller.usersInput([
                {
                    type: 'slash_command',
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

            assert.strictEqual(reply.text, `This is a plain reply`);
        });

        it(`should reply "This is a public reply" on public`, async () => {
            const text = 'public';
            const response_url = 'response_url/public';
            await this.controller.usersInput([
                {
                    type: 'slash_command',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: text,
                            isAssertion: true,
                            response_url
                        }
                    ]
                }
            ]);

            const reply = this.controller.apiLogByKey[response_url][0];
            assert.strictEqual(reply.text, `This is a public reply`);
        });

        it(`should reply "This is a private reply" on private`, async () => {
            const text = 'private';
            const response_url = 'response_url/public';
            await this.controller.usersInput([
                {
                    type: 'slash_command',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: text,
                            isAssertion: true,
                            response_url
                        }
                    ]
                }
            ]);

            const reply = this.controller.apiLogByKey[response_url][0];
            assert.strictEqual(reply.text, `This is a private reply`);
        });

        it(`should add httpBody for default response`, async () => {
            await this.controller.usersInput([
                {
                    type: 'slash_command',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'default',
                            isAssertion: true,
                        }
                    ]
                }
            ]);

            assert.deepStrictEqual(this.controller.httpBodyLog[0], {text: 'You can send an immediate response using bot.httpBody()'});
        })
    });

    describe('interactive_message', () => {
        beforeEach(() => {
            initController();
        });


        it(`should reply interactive on replace`, async () => {
            const actionName = 'replace';
            const response_url = 'response_url/public';
            await this.controller.usersInput([
                {
                    type: 'interactive_message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            isAssertion: true,
                            actions: [{
                                name: actionName
                            }],
                            response_url
                        }
                    ]
                }
            ]);
            const reply = this.controller.apiLogByKey[response_url][0];
            assert.strictEqual(reply.text, `[ A previous message was successfully replaced with this less exciting one. ]`);
        });

        it(`should reply with dialog on dialog`, async () => {
            const actionName = 'dialog';
            const response_url = 'response_url/public';
            await this.controller.usersInput([
                {
                    type: 'interactive_message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            isAssertion: true,
                            actions: [{
                                name: actionName
                            }],
                            response_url
                        }
                    ]
                }
            ]);

            assert.deepStrictEqual(this.controller.apiLogByKey['dialog.open'][0], {
                "dialog": {
                    "callback_id": "123",
                    "elements": [
                        {
                            "label": "Field 1",
                            "name": "field1",
                            "type": "text",
                        },
                        {
                            "label": "Field 2",
                            "name": "field2",
                            "type": "text"
                        }
                    ],
                    "notify_on_cancel": true,
                    "state": "foo",
                    "submit_label": "Submit",
                    "title": "this is a dialog",
                },
                "token": "mock-token"
            });
        });

        it(`should reply "Got a button click!" on default`, async () => {
            const actionName = 'default';
            const reply = await this.controller.usersInput([
                {
                    type: 'interactive_message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            isAssertion: true,
                            actions: [{
                                name: actionName
                            }]
                        }
                    ]
                }
            ]);

            assert.strictEqual(reply.text, `Got a button click!`);
        });
    });

    describe('dialog_submission', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply "Got a dialog submission"`, async () => {
            const text = 'fee bar';
            const reply = await this.controller.usersInput([
                {
                    type: 'dialog_submission',
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

            assert.deepStrictEqual(this.controller.httpBodyLog[0], JSON.stringify({
                "errors": [{
                    "name": "field1",
                    "error": "there was an error in field1"
                }]
            }));
            assert.strictEqual(reply.text, `Got a dialog submission`);
        });
    });

    describe('dialog_cancellation', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply "Got a dialog cancellation"`, async () => {
            const text = 'fee bar';
            const reply = await this.controller.usersInput([
                {
                    type: 'dialog_cancellation',
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

            assert.strictEqual(reply.text, `Got a dialog cancellation`);
        });
    });
});

