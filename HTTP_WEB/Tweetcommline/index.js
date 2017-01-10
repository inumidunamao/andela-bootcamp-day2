#!/usr/bin/env node

var App = require('./App/app').App;
	
var oauth_obj = {
	req_token_url : 'https://api.twitter.com/oauth/request_token',
	access_token_url : 'https://api.twitter.com/oauth/access_token',
	oauth_version : '1.0',
	hash_version : 'HMAC-SHA1',
	cosumer_secret : 'CSuz6zyJbdGa7P14E1W1c12C2yhFnOPi6Eeph3rgVMZoJzpJG9',
	consumer_key : 'UftdbBzoann2KOgYqMx3eW4a4',
}

var app = new App(oauth_obj);

app.getUserAccess();

app.addListener(app.refresh);
