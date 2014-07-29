var Stomp = require('stomp-client').StompClient // SecureStompClient
  , q = require('q')
  , _ = require('underscore')
  , prettyjson = require('prettyjson')
;

var NetworkRail = function() {
    this.client = false;
    this.listeners = {};
    this.topics = {
        'movements': {
            'all': 'TRAIN_MVT_ALL_TOC',
        },
    };
};

NetworkRail.prototype.connect = function(user, pass) {
    var deferred = q.defer()
      , self = this;

    console.log('Connecting...');

    this.client = new Stomp('datafeeds.networkrail.co.uk', 61618, user, pass);
    this.client.connect(function(session) {
        console.log('...done');

        // http://nrodwiki.rockshore.net/index.php/Train_Movement
        self.client.subscribe('/topic/' + self.topics.movements.all, function(body, headers) {
            self.callListeners(self.topics.movements.all, body, headers);
        });
    });
};

NetworkRail.prototype.disconnect = function() {
    console.log('Disconnecting...');
    this.client.disconnect();
    console.log('...done');
}

NetworkRail.prototype.callListeners = function(topic, body, headers) {
    this.listeners[topic].forEach(function(callback) {
        callback(JSON.parse(body), headers);
    });
};

NetworkRail.prototype.listen = function(topic, options, callback) {
    options = _.defaults(options || {}, {
        'messageTypes': [],
    });

    if (!_.has(this.listeners, topic)) {
        this.listeners[topic] = [];
    }

    this.listeners[topic].push(callback);
};

module.exports = new NetworkRail();