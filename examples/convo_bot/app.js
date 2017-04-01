'use strict';
/*
Run your bot from the command line:
token=<MY TOKEN> node app.js
*/
if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}


var Botkit = require('botkit')
var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: process.env.token
});

require('./indexController')(controller);

bot.startRTM((err, bot, res) => {
    if (err)
        throw new Error('Could not connect to Slack');
});