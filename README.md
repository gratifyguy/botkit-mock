# README #

BotMock - Test Botkit and Slack responses

### Setup ###

1. Run `npm install`
2. Run `npm test`

### Flags ###
`first` - if true, indicates that the user spoke first.

`deep` - indicates which message to return in `.then()`. 1 is the last message, 2 is the second-to-last, etc..

### How To Use ###

You can include `botMock` in your own Botkit project to mock Botkit responses. Just subsitute `botMock` when testing.

```
var bot;
if(env !== 'test'){
    bot = require('../app/bots/bot');
}
else{
    var botMock =  require('../test/mock/botMock');
    bot = new botMock.controller('userSlackId', 'userName').bot;
}
```

Then this...

```
controller.hears(['help'], 'direct_message', function(bot, message){
    bot.reply(message, 'help message');
});
```

can be tested like this...

```
it('should return `help message` if user types `help`', (done)=>{
	var self = this;
	return self.controller.usersInput([{
            first:true,
            user: self.slackId,
            messages:[{text: 'help', isAssertion:true}]
        }]).then((text)=>{
            assert.equal(text, 'help message')
            done()
        })
});
```