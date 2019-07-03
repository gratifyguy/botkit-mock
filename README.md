# Botkit-Mock - Write tests for [Botkit](https://github.com/howdyai/botkit).
[![npm](https://img.shields.io/npm/l/botkit.svg)](https://spdx.org/licenses/MIT)
[![Build Status](https://travis-ci.org/gratifyguy/botkit-mock.svg?branch=master)](https://travis-ci.org/gratifyguy/botkit-mock)


## Setup ##

1. `npm install --save botkit-mock`
2. Require `botkit-mock` in your test: `const { Botmock } = require('botkit-mock');`
3. Require your controller in your test: `const fileBeingTested = require("./indexController")`
4. Follow test case examples seen [here](/examples)

## Basic Usage ##

### Testing Controllers ###

Let's say you have a controller that looks something like this:

```javascript
module.exports = function(controller) {
    // simple answer
    controller.hears(['help'], 'direct_message', function (bot, message) {
        bot.reply(message, 'help message');
    });
}
```

To use `botkit-mock`, you can test your controller like below:

```javascript
const { Botmock, SlackApiMock } = require('botkit-mock');
const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack');

const yourController = require("./yourController");

describe("controller tests",()=>{
    beforeEach(()=>{
       const adapter = new SlackAdapter({
            clientSigningSecret: "secret",
            botToken: "token",
            debug: true
        });
   
        adapter.use(new SlackEventMiddleware());
        adapter.use(new SlackMessageTypeMiddleware());
   
        this.controller = new Botmock({
            adapter: adapter,
            disable_webserver: true
        });
   
        SlackApiMock.bindMockApi(this.controller);
        yourController(this.controller);
    });
});
```

In your `it` statement, use the `bot.usersInput` method to define the conversation.

```javascript
it('should return `help message` if user types `help`', async () => {
    const message = await this.bot.usersInput(
        [
            {
                user: 'someUserId',
                channel: 'someChannel',
                messages: [
                    {
                        text: 'help', isAssertion: true
                    }
                ]
            }
        ]
    );
    /* example of botkit response
    { type: 'message',
      text: 'help message',
      attachmentLayout: undefined,
      attachments: undefined,
      suggestedActions: undefined,
      speak: undefined,
      inputHint: undefined,
      summary: undefined,
      textFormat: undefined,
      importance: undefined,
      deliveryMode: undefined,
      expiration: undefined,
      value: undefined,
      channelData:
       { channelId: 'slack',
         serviceUrl: '',
         conversation: { id: 'someChannel', thread_ts: null },
         from: { id: '' },
         recipient: { id: 'someUserId' } },
      channelId: 'slack',
      serviceUrl: undefined,
      conversation: { id: 'someChannel', thread_ts: null },
      from: { id: undefined },
      recipient: { id: 'someUserId' } 
      }
     */
    return assert.equal(message.text, 'help message');
});
```

## Advance usage
`Botkit` itself depends on adapters (slack, facebook, etc.).
`Botmock` is an extension of `Botkit` provides interface for accepting user messages through `.usersInput`.
You could connect any botkit providers to botmock.
For now, we have only advance slack binding for the [slack provider](https://github.com/howdyai/botkit/tree/master/packages/botbuilder-adapter-slack). 
```javascript
const { Botmock, SlackApiMock } = require('botkit-mock');
const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack');
const adapter = new SlackAdapter({
    clientSigningSecret: "secret",
    botToken: "token",
    debug: true
});

adapter.use(new SlackEventMiddleware());
adapter.use(new SlackMessageTypeMiddleware());

const controller = new Botmock({
    adapter: adapter,
    disable_webserver: true
});

SlackApiMock.bindMockApi(controller);
```
`SlackApiMock` - binds to botmock `controller` next properties:
* `controller.axiosMockAdapter` - [axios mock](https://github.com/ctimmerm/axios-mock-adapter) entity helps to mock requests to slack api, botkit slack provider uses axios as request lib, [here](/test/updateApiResponsesSpec.js) are examples how to mock requests
* `controller.apiLogByKey` - object with logged requests over `bot.api.` 
* `controller.httpBodyLog` - array of botkit responses to slack in some cases 

## .usersInput options
1. `user` user slackId (required) (string)
2. `channel` is a channel where user sends messages (required) (string)
3. `type` specify botkit message type. ie `direct_message`, `message_received`, `interactive_message_callback`. (defaults to `direct_message`) (string)
4. `messages` (array) that includes:
    - `isAssertion` indicates which conversation response array to return in `.then()` in multi-user testing. (required) (boolean)
    - `deep` indicates the index of the conversation response to return in `.then()`. 0 (default) is the last response, 1 is the second-to-last, etc.. (integer)
    - `timeout` set timeout for message in milliseconds (integer)
    - `waitBefore` alias for `timeout`, indicates how many milliseconds to wait before sending the message to the bot (integer)
    - `waitAfter` indicates how many milliseconds to wait for the bot response, useful for long-running commands (integer)
    - `text` the message's text (string)
    - `channel` indicates the channel the message was sent in. This overrides the channel defined in `usersInput` for this current message. (string)
    - ...any other fields you may be testing for including `attachments`, `callback_id`, etc...


## Contributing ##
`botkit-mock` currently (and will always) support all of Botkit's core functionality by default. We also support extended Slack and Facebook functionality. 

To add functionality to `botkit-mock`, you can create platform-specific functions like seen in [FacebookBotWorker](https://github.com/gratifychat/botkit-mock/blob/3f74a87d16cfa432dcc42c191c6e5542cc3c393f/lib/FacebookBotWorker/index.js). If you add functionality to support something we don't, please make a PR.

## Examples ##

- [botkit-slack](examples/botkit-slack) - tests for a fresh Botkit starter kit, from the Yeoman generator or [a starter kit on Glitch](https://glitch.com/botkit)
                                                    
```
npm install -g yo generator-botkit
yo botkit
```
- [api](./tests/updateApiResponsesSpec.js) - simple api calls and api response overrides


Built by the team at https://www.gratify.chat.

Like botkit-mock? Donate BTC to our team: 1KwpqzTvpLWiUST2V5wmPiT3twwc1pZ9tP

## [Change Log](CHANGELOG.md)