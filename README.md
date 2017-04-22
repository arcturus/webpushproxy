WebPushProxy
============
WebPushProxy is a tiny http service that will send a web push message with the parameteres specified via post.

## Motivation

Webpush is a rapid growing and fascinating feature from the web platform. There are fantastic [documentation](https://developer.mozilla.org/en/docs/Web/API/Push_API) and [tutorials](https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web) and that explain how to use the crypto functions, payload and extra steps to send push notifications.

Even better, the community is creating libraries for your favourite language to simplify the use of webpush, take a look to the project [Web Push Libs](https://github.com/web-push-libs), where you can find helper libraries for your favourite programing language.

But in certain situations (like my favourite language is not supported, or I'm working on an embedded device), we cannot use any of those fantastic libraries, on those cases *WebPushProxy* can help, just perform an http post request.

*WebPushProxy* is just a (nodejs) web service that is wrapping the [nodejs library for webpush](https://github.com/web-push-libs/web-push), mimicking it's features and parameters needed.

## Examples

### Generating vapid credentials
```bash
curl https://<webpushproxyhost>/generatevapid

{"publicKey":"BHK7pZrLA8uLlvnz8BM0FjuAyUpn7lw7lTxmjK8Xpf5xRHhCTXe2WZ1www2vqz9H3UfsqNXvk25-Bz91pTFE0yE",
 "privateKey":"SmnRehwyvIjOq7_uJDNT3q0ao0tW8mluG9OabYbWErc"}

```

### Sending a message with payload
```bash
curl -X POST https://<webpushproxyhost>/ \
-H 'Content-Type: application/json' \
-d @- << EOF
{
    "endpoint": "https://updates.push.services.mozilla.com/wpush/v1/gAAAAABY-TKHj61H3fZyg9EOpMq5wFji37K_H1Ul6qM8fzZGoJFkWhCZcgpXdWF6I8GbfZbQveE-MnhC1lT5SFM1EABNlWgJAphu_IOLJXoXa3sHY3cjhJOyL3H6TR8-Q-UA1II5IMJM",
    "key": "BAeogPoBLTijZhC36JbbWbIp/IhuG5IdLSwURTK7uZBBLx1+2kStqUKw/Z8HgXSgGZRTZrfiqoyYd3zKeRqSBTU=",
    "authSecret": "FH/uk7ivefbH64TC6fEj1g==",
    "payload": {
        "data": "Here is my data"
    },
    "vapidDetails": {
        "publicKey": "BPfLTxhwF3OFu7GPe6WkrIk6bFBoMUUjEfocwyIemJpauv62QgigSYE3Rg8zgj0631cJuCDcrj03j48nruq4y2o",
        "privateKey": "E62EX4WkjJ8xZLoDlcydVIykojCPeg5fn5Y3jmT6R4Y",
        "subject": "mailto:myemail@provider.com"
    }
}
EOF
```
* Note: If you are using GCM add an extra parameter to your json payload: 'gcmAPIKey', with the Google api key.

## Extras
I highly recommend to deploy your own version of this webservice, configure it for being served via https via [letsencrypt](https://letsencrypt.org/), should be pretty straight forward.

But if you just want to give it a try, I deployed a version for testing in the following end point:
```
https://webpushproxy.progressiveweb.pw/
```

```bash
#Generate vapid keys
curl https://webpushproxy.progressiveweb.pw/generatevapid
```

*Note*: That service is just a test, use at your own risk, but I cannot grant availability of any kind ;)
