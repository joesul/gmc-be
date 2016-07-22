var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var request = require('request');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://heroku_489lrxbs:38s0chm1bqciuvn4t4bqt3tc78@ds027215.mlab.com:27215/heroku_489lrxbs';

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

PORT = process.env.PORT || 80 || 3000;
app.listen(PORT, function(){
  console.log('listen to events on Port: ' PORT)
});
