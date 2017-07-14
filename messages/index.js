/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var spbot = require('./spbot.js');
var restify = require('restify');
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: "446d96da-69c2-4313-a499-e1c555c983f8",
    appPassword: "xVn76K1K7oYWzdW7WbAGKOJ"
});
server.post('/api/messages', connector.listen());

//Uncomment for Prod
/*
var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});
*/
var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d4c7b802-b6e8-48f7-9203-d20029763f2c?subscription-key=57eeb6245eee4b019fb729679ab72863&timezoneOffset=0&verbose=true&q=");

bot.recognizer(recognizer);

var intents = new builder.IntentDialog({ recognizers: [recognizer] })
    .matches('PasswordReset', [
        (session, args) => {
            session.send(spbot.PasswordReset).endDialog();
        }
    ])
    .matches('OrderSoftware', [
        (session, args) => {
            session.send(spbot.OrderSoftawre).endDialog();
        }
    ])
    .onDefault((session) => {
        session.send(spbot.FallbackIntentMessage).endDialog();
    });

bot.dialog('/', intents);

/*
if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}*/
