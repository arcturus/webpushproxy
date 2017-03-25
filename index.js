var fs = require('fs')
    , https = require('https')
    , express = require('express')
    , webpush = require('web-push')
    , app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.redirect('https://github.com/arcturus/webpushproxy');
});

app.post('/', function(req, res) {
  var pushData = req.body;

  if (!pushData.endpoint || !pushData.authSecret || !pushData.key) {
    return res.status(400).send({error: 'Not enough parameters'});
  }

  var pushSubscription = {
    endpoint: pushData.endpoint,
    key: pushData.key,
    auth: pushData.authSecret
  };

  var payload = pushData.payload || null;

  var options = {};
  var optionsNames = ['gcmAPIKey', 'vapidDetails', 'TTL', 'headers'];
  optionsNames.forEach(function(option) {
    if (pushData[option]) {
      options[option] = pushData[option];
    }
  });

  webpush.sendNotification(pushSubscription, payload, options)
    .then(function(result) {
      res.status(result.statusCode).send(result.body);
    }, function(err) {
      res.status(err.statusCode).send(err.body);
    });
});

app.get('/generatevapid', function(req, res) {
  var vapidKeys = webpush.generateVAPIDKeys();
  res.status(200).send(vapidKeys);
});


var port = process.env.WEBPUSHPROXY_PORT || 4443;

https.createServer({
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
}, app).listen(port);
console.log('Server started at port', port);
