# Botkit-Mock - Write tests for [Botkit](https://github.com/howdyai/botkit).
[![npm](https://img.shields.io/npm/l/botkit.svg)](https://spdx.org/licenses/MIT)
[![Build Status](https://travis-ci.org/gratifychat/botkit-mock.svg?branch=master)](https://travis-ci.org/gratifychat/botkit-mock)


## Setup ##

1. `npm install --save botkit-mock`
2. Require `botkit-mock` in your test: `const Botmock = require('botkit-mock');`
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
const Botmock = require('botkit-mock');
const yourController = require("./yourController");

describe("controller tests",()=>{
    beforeEach((done)=>{
        this.bot = Botmock({});
        // type can be ‘slack’, facebook’, or null
        this.bot = this.controller.spawn({type: 'slack'});
        yourController(this.controller);
    });
});
```

In your `it` statement, use the `bot.usersInput` method to define the conversation.

```javascript
it('should return `help message` if user types `help`', (done) => {
    return this.bot.usersInput(
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
    ).then((message) => {
        // In message, we receive a full object that includes params:
        // {
        //    user: 'someUserId',
        //    channel: 'someChannel',
        //    text: 'help message',
        // }
        assert.equal(message.text, 'help message');
        done()
    })
});
```
## Advanced Usage ##

`botExtender` - allows developers to extend the bot and add custom functions to the `bot`. This overrides functionality in [BotmockWorker.js](https://github.com/gratifychat/botkit-mock/blob/migrate_to_botkit_core/lib/BotmockWorker.js).

To use this, define `botExtender` in your `beforeEach`. It accepts three parameters `(bot, botkit, config)`, which are passed in from [Botmock.js](https://github.com/gratifychat/botkit-mock/blob/migrate_to_botkit_core/lib/Botmock.js) and [BotmockWorker.js](https://github.com/gratifychat/botkit-mock/blob/migrate_to_botkit_core/lib/BotmockWorker.js). Pass `botExtender` to your `.spawn()` and you will have access to your custom functions in the `it`.

```javascript
beforeEach(()=>{
        function botExtender(bot, botkit, config){
            bot.customReply = function(message, text){
                bot.reply(message, 'Something new...' + text)
            }
        }
        this.bot = this.controller.spawn({type: 'slack', botExtender: botExtender});
    });
```

## usersInput options
1. `user` user slackId (required) (string)
2. `channel` is a channel where user sends messages (required) (string)
3. `type` specify botkit message type. ie `direct_message`, `message_received`, `interactive_message_callback`. (defaults to `direct_message`) (string)
4. `messages` (array) that includes:
    - `isAssertion` indicates which conversation response array to return in `.then()` in multi-user testing. (required) (boolean)
    - `deep` indicates the index of the conversation response to return in `.then()`. 0 (default) is the last response, 1 is the second-to-last, etc.. (integer)
    - `timeout` set timeout for message in milliseconds (integer)
    - `text` the message's text (string)
    - `channel` indicates the channel the message was sent in. This overrides the channel defined in `usersInput` for this current message. (string)
    - ...any other fields you may be testing for including `attachments`, `callback_id`, etc...


## Contributing ##
`botkit-mock` currently (and will always) support all of Botkit's core functionality by default. We also support extended Slack and Facebook functionality. 

To add functionality to `botkit-mock`, you can create platform-specific functions like seen in [FacebookBotWorker](https://github.com/gratifychat/botkit-mock/blob/3f74a87d16cfa432dcc42c191c6e5542cc3c393f/lib/FacebookBotWorker/index.js) If you add functionality to support something we don't, please make a PR.

## Examples ##

- [botkit-starter-slack](examples/botkit-starter-slack) - tests for [botkit starter kit](https://github.com/howdyai/botkit-starter-slack) (files with name `*mochaSpec.js`)
- [convo_bot](examples/convo_bot) - tests for simple bot convo  (files with name `*MochaSpec.js` or `*JasmineSpec.js`)
- [api](./tests/updateApiResponseMochaSpec.js) - simple api calls and api response overrides


Built by the team at https://www.gratify.chat.

