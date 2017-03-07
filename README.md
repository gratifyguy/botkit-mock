# Botkit-Mock - Write tests for Botkit.
[![npm](https://img.shields.io/npm/l/botkit.svg)](https://spdx.org/licenses/MIT)
[![Build Status](https://travis-ci.org/gratifychat/botkit-mock.svg?branch=master)](https://travis-ci.org/gratifychat/botkit-mock)


## Setup ##

1. `npm install --save botkit-mock`
2. Require `botkit-mock` in your test: `const mock = require('botkit-mock');`
3. Require your controller in your test: `const fileBeingTested = require("../controllers/indexController")`
4. Follow test case examples seen [here](https://github.com/gratifychat/botkit-mock/tree/master/test)

## Basic Usage ##

### Testing Controllers ###

Let's say you have a controller that looks something like this:

```
module.exports = function(bot, controller) {
    // simple answer
    controller.hears(['help'], 'direct_message', function (bot, message) {
        bot.reply(message, 'help message');
    });
}
```

To use `botkit-mock`, you should setup your controller as follows in your `beforeEach`:

```
const mock = require('botkit-mock');
const yourController = require("../yourController");

describe("controller tests",()=>{
    beforeEach((done)=>{
        var self = this;
        self.controller = new mock.controller()
        yourController(self.controller.bot, self.controller)
        done();
    });
});
```

In your `it` statement, use the `controller.usersInput` method to define the conversation.

```
it('should return `help message` if user types `help`', (done) => {
    var self = this;
    return self.controller.usersInput(
        [
            {
                first: true,
                messages: [
                    {
                        text: 'help', isAssertion: true
                    }
                ]
            }
        ]
    ).then((text) => {
        assert.equal(text, 'help message')
        done()
    })
});
```

### Options ###
`usersInput` takes an array of objects with the following fields:

**Mandatory**
- `first` indicates which user spoke first in multi-user testing.
- `messages` is an array of objects that have two fields
    - `text` is the text of the message (Mandatory)
    - `isAssertion` indicates which conversation response array to return in `.then()` in multi-user testing.
    - `channel` indicates the channel the message was sent in

**Optional**
- `type` specify botkit message type. IE `direct_message` or `message_received` 
- `user` specifies the userId of the user sending the message
- `deep` indicates the index of the conversation response to return in `.then()`. 0 is the last response, 1 is the second-to-last, etc..


### Testing API ###
See examples [here](https://github.com/gratifychat/botkit-mock/blob/master/test/apiMochaSpec.js).

Built by the team at https://www.gratify.chat.

