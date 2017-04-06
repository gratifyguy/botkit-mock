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

To use `botkit-mock`, you should setup your controller as follows in your `beforeEach`:

```javascript
const Botmock = require('botkit-mock');
const yourController = require("./yourController");

describe("controller tests",()=>{
    beforeEach((done)=>{
        this.controller = Botmock({});
        // type can be ‘slack’, facebook’, or null
        this.bot = this.controller.spawn({type: 'slack'});
        yourController(this.controller);
        done();
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
        //in message we receive full object include
        //{
        //    user: 'someUserId',
        //    channel: 'someChannel',
        //    text: 'help message',
        //}
        assert.equal(message.text, 'help message');
        done()
    })
});
```
## API ##
You can keep Botkit initialization and bot spawn just to change Botkit on Botmock
```javascript
        const Botmock = require('botkit-mock');
        var controller = Botmock({});
        var bot = controller.spawn({type: 'slack'});
```
`Botmock` - works like Botkit constructor
`controller.spawn` - works like origin method and has additional properties:
 - `type` 
    - `slack`
    - `facebook`
    - `null` - if you want define a new bot
 - `botExtender` - function with next arguments `(bot, botkit, config)` works as extender for existing bot (`facebook`, `slack`) or defining new one

###bot
Provide a method `usersInput` takes an array of objects with the following fields:
- `user` user slackId (required)
- `channel` is a channel where user send messages (required)
- `type` specify botkit message type. IE `direct_message`, `message_received`, `interactive_message_callback` etc...
    (if `null` or `undefined` be default set to `direct_message`)
- `messages` is an array of objects that have fields
    - `isAssertion` indicates which conversation response array to return in `.then()` in multi-user testing.
    - *** optional ***
    - `deep` indicates the index of the conversation response to return in `.then()`. 0 (default) is the last response, 1 is the second-to-last, etc..
    - `timeout` you can set timeout for message in milliseconds
    - `text` is the text of the message user message
    - `channel` indicates the channel the message was sent in, ignore channel defined on top level, only for current message
    - any field that can be received, `attachments`, `origing_mesassage`, `callback_id` etc...


## Examples ##

- [botkit-starter-slack](examples/botkit-starter-slack) - tests for [botkit starter kit](https://github.com/howdyai/botkit-starter-slack) (files with name `*mochaSpec.js`)
- [convo_bot](examples/convo_bot) - tests for simple bot convo  (files with name `*MochaSpec.js` or `*JasmineSpec.js`)
- [api](./tests/updateApiResponseMochaSpec.js) - simple api calls and api response overrides

Built by the team at https://www.gratify.chat.

