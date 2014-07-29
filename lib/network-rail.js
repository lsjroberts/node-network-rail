var request = require('request')
  , q = require('q')
;

var NetworkRail = function() {

};

NetworkRail.prototype.get = function(uri) {
    var deferred = q.defer();

    this.promise = deferred.promise;

    return this.promise;
};

module.exports = new NetworkRail();