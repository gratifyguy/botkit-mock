# README #

Botkit-Mock - Write tests for Botkit.

## Setup ##

1. `npm install --save botkit-mock`
2. Require `botkit-mock` in your test: ie `const mock = require('botkit-mock');`
3. If testing a controller, require your controller in your test: ie `const fileBeingTested = require("../controllers/indexController")`
4. Follow test case examples seen [here](https://github.com/gratifychat/botkit-mock/tree/master/test)

## Basic Usage ##

### Testing Controllers ###
In your `beforeEach`, setup a mock controller and pass it to `fileBeingTested`.

```
const assert = require('assert');
const mock = require('botkit-mock');
const fileBeingTested = require("../indexController");

describe("controller tests",()=>{
    beforeEach((done)=>{
        var self = this;
        self.slackId = 'some id'
        self.userName = 'some username'
        self.controller = new mock.controller()
        fileBeingTested(self.controller.bot,self.controller)
        done();
    });
```

In your `it` statement, use the `controller.usersInput` method to define the conversation.

```
    it('should return hello', (done)=>{
        var self = this;
        return self.controller.usersInput([{
            type: null,
            first:true,
            messages:[{text: 'quick', isAssertion:true}]
        }]).then((text)=>{
            assert.equal(text, 'hello')
            done();
        })
    });
});
```
### Options ###
You can specify options to `usersInput`.

`first` - indicates which user spoke first in multi-user testing.

`deep` - indicates the index of the conversation response to return in `.then()`. 0 is the last response, 1 is the second-to-last, etc..

`isAssertion` - indicates which conversation response array to return in `.then()` in multi-user testing. 

### Testing API ###
See examples [here](https://github.com/gratifychat/botkit-mock/blob/master/test/apiMochaSpec.js).

Built by the team at https://www.gratify.chat.

## License

And of course:

MIT: http://rem.mit-license.org
