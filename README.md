# Botkit-Mock - Write tests for Botkit.
[![npm](https://img.shields.io/npm/l/botkit.svg)](https://spdx.org/licenses/MIT)
[![Build Status](https://travis-ci.org/gratifychat/botkit-mock.svg?branch=master)](https://travis-ci.org/gratifychat/botkit-mock)


## Setup ##

1. `npm install --save botkit-mock`
2. Require `botkit-mock` in your test: `const Botmock = require('botkit-mock');`
3. Require your controller in your test: `const fileBeingTested = require("../controllers/indexController")`
4. Follow test case examples seen [here](https://github.com/gratifychat/botkit-mock/tree/master/test)

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
const yourController = require("../yourController");

describe("controller tests",()=>{
    beforeEach((done)=>{
        this.controller = Botmock({});
        this.bot = this.controller.spawn({type: 'slack'});
        yourController(this.controller);
        done();
    });
});
```

In your `it` statement, use the `controller.usersInput` method to define the conversation.

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

### Options ###
`usersInput` takes an array of objects with the following fields:

**Mandatory**
- `user` user slackId (required)
- `channel` is a channel where user send messages (required)
- `type` specify botkit message type. IE `direct_message`, `message_received`, `interactive_message_callback` etc...
    (if `null` or `undefined` be default set to `direct_message`)
- `messages` is an array of objects that have fields
    - `isAssertion` indicates which conversation response array to return in `.then()` in multi-user testing.
    - `deep` indicates the index of the conversation response to return in `.then()`. 0 is the last response, 1 is the second-to-last, etc..
    - *** optional ***
    - `text` is the text of the message user message
    - `channel` indicates the channel the message was sent in, ignore channel defined on top level, only for current message
    - any field that can be received, `attachments`, `origing_mesassage`, `callback_id` etc...


### Testing API ###
See examples [here](https://github.com/gratifychat/botkit-mock/blob/master/test/apiMochaSpec.js).

Built by the team at https://www.gratify.chat.

