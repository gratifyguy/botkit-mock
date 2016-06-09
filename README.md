# README #

BotMock - Test Botkit and Slack responses

### Setup ###

1. Run `npm install`
2. Run `npm test`

### How To Use ###

You can include `botMock.js` in your own Botkit project. Just inject `bot` during tests. We've included a sample Botkit controller (`bot/indexController`) that is tested in `test/controllerSpec`. We've also included a way to mock API responses and update their values from within the tests..this is in `apiMock.js`.
