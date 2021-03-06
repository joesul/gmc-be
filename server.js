var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var request = require('request');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.MONGODB_URI;
var nflKey = process.env.NFL_API_KEY;

app.get('/jmc', function(req, res) {
  res.json({"description": "1st Down!"});
});

app.get('/jmc/favorites', function(request, response){

  MongoClient.connect(mongoUrl, function (err, db) {
    var favoriteTeams = db.collection('nfl_teams');
    if (err) {
      console.log("Unable to connect to the mongoDB server. ERROR:", err);
    }
    else {
      console.log("Connection established to", mongoUrl);
    }
      favoriteTeams.find().toArray(function (err, result) {
        if (err) {
          console.log("ERROR!", err);
          response.json("error");
        }
        else if (result.length) {
          console.log('Found:', result);
          response.json(result);
        }
      });
    })
  });

app.post('/jmc/search', function(req, res) {
  var fullQuery = 'https://api.fantasydata.net/nfl/v2/JSON/Standings/2015';

  request({
    url: fullQuery,
    headers: { "Ocp-Apim-Subscription-Key" : nflKey},
    method: 'GET',
    callback: function(error, response, body){
      res.send(JSON.parse(body));
    }
  })
});

app.post('/jmc/favorites', function(req, res) {
  MongoClient.connect(mongoUrl, function(err, db) {
    var favoriteTeams = db.collection('nfl_teams');
    if (err) {
      console.log('Unable to connect to the mongoDB server. ERROR:', err);
    } else {
      console.log('Connection established to', mongoUrl);

      var newTeam = req.body;
      console.log(newTeam);

      favoriteTeams.insert([newTeam], function(err, result) {
        if (err) {
          console.log(err);
          res.json("error");
        } else {
          console.log("Inserted.");
          console.log("RESULT!!!!", result);
          console.log("end result");
          res.json(result);
        }
      })
    }
  })
});

app.delete('/jmc/delete', function(request, response) {

  MongoClient.connect(mongoUrl, function(err, db) {
    var favoriteTeams = db.collection('nfl_teams');
    if (err) {
      console.log('Unable to connect to the mongoDB server. ERROR:', err);
    } else {
      console.log('Connection established to', mongoUrl);

      favoriteTeams.remove({}, function(err, result) {
        if(err) {
          console.log("error!", err);
          response.json("error");
        }
         else {
          console.log("Found:", result);
          response.json(result);
        }
      });
    }
  });
});



PORT = process.env.PORT || 80;
app.listen(PORT, function(){
  console.log('listen to events on Port: ', PORT);
});
