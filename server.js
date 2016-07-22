var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var request = require('request');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/jmc_db';

app.get('/jmc', function(req, res) {
  res.json({"description": "1st Down!"});
});

app.post('/jmc/search', function(req, res) {
  var fullQuery = 'https://api.fantasydata.net/nfl/v2/JSON/FantasyDefenseByGameByTeam/2015REG/1/NYJ?'

  request({
    url: fullQuery,
    headers: { "Ocp-Apim-Subscription-Key" : "37eb9a6450e94212a32b615e768f4ded"},
    method: 'GET',
    callback: function(error, response, body){
      res.send(body);
    }
  })
});

app.listen(3000, function(){
  console.log('listen to events on Port 3000.')
});
