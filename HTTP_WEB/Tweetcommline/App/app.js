var OAuth = require('oauth').OAuth,
    chalk = require('chalk'),
    co = require('co'),
    prompt = require('co-prompt'),
    events = require('events').EventEmitter,
    moment = require('moment'),
    util = require('util'),
    Entities = require('html-entities').AllHtmlEntities;

var entities = new Entities();

var App = function(auth_obj){

	this.ACCESS_TOKEN_URL = auth_obj.access_token_url;
	this.REQUEST_TOKEN_URL = auth_obj.req_token_url;
	this.OAUTH_VERSION =auth_obj.oauth_version;
	this.HASH_VERSION = auth_obj.hash_version;
	this.CONSUMER_KEY = auth_obj.consumer_key;
	this.CONSUMER_SECRET = auth_obj.cosumer_secret;
  this.util = {
    ago: function(timestamp){
      var ISOtimestamp = new Date(timestamp).toISOString();
      try {
        var time_ago = moment(ISOtimestamp).startOf('minute').fromNow();
      } catch (err){
        var time_ago = "___" ;
      }
      return time_ago;
    },
    beautify: function(uglyData){
      var beautiful = "";
      for (var i = 0; i < uglyData.length; i++){
        var b = chalk.bold.blue('\t'+uglyData[i].userName) + '\n\t'+
              chalk.blue('@'+uglyData[i].screenName) + '\n\t'+
              chalk.bold(entities.decode(uglyData[i].tweet)) + '\n\t' +
              chalk.green(this.ago(uglyData[i].timestamp) +'\n\n');
        beautiful += b;
      }
      return beautiful;
    }
  }
}

util.inherits(App, events);

App.prototype.fetchData = function(oauth_obj){
    var Self = this;
    console.log(chalk.green("Fetching data, please wait..."));
    oauth_obj.get(
        'https://api.twitter.com/1.1/statuses/home_timeline.json?count=20',
        Self.ACCESS_TOKEN,
        Self.ACCESS_TOKEN_SECRET,
        function (err, data, res){
          if (err) {
            console.log("An eror occured");
            process.exit(1);
          }
          var parseData = JSON.parse(data); 
          var cleanData = parseData.map(function(item){
            return {tweet: item.text, userName:item.user.name, screenName: item.user.screen_name, timestamp:item.created_at}
          });
          Self.Data = Self.util.beautify(cleanData);
          Self.emit('change');
          return true;
        });
    }

App.prototype.getRequestToken = function(oauth_obj){
  this.oauth_obj = oauth_obj;
  var Self = this;
	oauth_obj.getOAuthRequestToken(function(err, oauth_token, oauth_token_secret, results){
    
    if(err) {
      console.log(chalk.bold.red("\nERROR: " + ([err.syscall, err.code, err.hostname+":"+err.port]).join(" ")) + '\n');
      process.exit(1);
    } else { 
      console.log(chalk.bold('> Login to your twitter account on you browser\n'));
      console.log(chalk.bold('> visit : ')+chalk.blue('https://twitter.com/oauth/authorize?oauth_token='+ oauth_token+'\n'));
      co(function *(){
      	var pin = yield prompt(chalk.bold("> Enter pin here: "));
        Self.getAccessToken(oauth_obj, oauth_token, oauth_token_secret, pin);

      });
    }
  });	
}

App.prototype.getAccessToken = function(oauth_obj, oauth_token, oauth_token_secret, pin){
  var Self = this;
  oauth_obj.getOAuthAccessToken(oauth_token, oauth_token_secret, pin,
    function(err, oauth_access_token, oauth_access_token_secret, results2) { 
      if (err) {
        if (err.statusCode == '401') {
          console.log(chalk.bold.red("\n> Pin is incorrect!\n"));
        }
        process.exit(1);
      }
      Self.ACCESS_TOKEN = oauth_access_token;
      Self.ACCESS_TOKEN_SECRET = oauth_access_token_secret;
      var c = Self.fetchData(oauth_obj, Self.ACCESS_TOKEN, Self.ACCESS_TOKEN_SECRET );
  });
}


App.prototype.getUserAccess = function(){
	var new_oauth_obj = new OAuth(this.REQUEST_TOKEN_URL, 
					this.ACCESS_TOKEN_URL, 
					this.CONSUMER_KEY, 
					this.CONSUMER_SECRET, 
					this.OAUTH_VERSION, 
					null, 
					this.HASH_VERSION); 
	this.getRequestToken(new_oauth_obj);
  
}

App.prototype.refresh = function(){
  console.log(this.Data);
  var Self = this;
  co(function *(){
    var refresh = yield prompt('Refresh or End?(r/e) > ');
    if (refresh === 'r') {
      console.log(chalk.bold.green("Refreshing..."))
      Self.fetchData(Self.oauth_obj);
    } else if(refresh === 'e') {
      console.log(chalk.bold.green("Exiting..."));
      process.exit(1);
    } else {
      console.log(chalk.bold.red("Response not understood. Exiting..."))
      process.exit(1);
    }
  })
  
}

App.prototype.addListener = function(callback){
  this.on('change', callback);
}

module.exports = {App : App}