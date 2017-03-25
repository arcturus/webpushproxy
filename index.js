var express = require('express')
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
    keys: {
      auth: pushData.authSecret,
      p256dh: pushData.key
    }
  };

  var payload = JSON.stringify(pushData.payload) || null;

  var options = {};
  var optionsNames = ['gcmAPIKey', 'vapidDetails', 'TTL', 'headers'];
  optionsNames.forEach(function(option) {
    if (pushData[option]) {
      options[option] = pushData[option];
    }
  });

  webpush.sendNotification(pushSubscription, payload, options)
    .then(function(result) {
      return res.status(result.statusCode).send(result.body || 'ok');
    }, function(err) {
      return res.status(400).send('' + err);
    });
});

app.get('/generatevapid', function(req, res) {
  var vapidKeys = webpush.generateVAPIDKeys();
  res.status(200).send(vapidKeys);
});


var port = process.env.WEBPUSHPROXY_PORT || 8080;
app.listen(port, function() {
  console.log('Server started at port', port);
});
