var request = require('request')
  , q = require('q')
;

var NationalRail = function() {
    this.baseUrl = 'http://nationalrail.co.uk';
};

NationaRail.prototype.get = function(uri) {
    var deferred = q.defer();

    this.promise = deferred.promise;

    console.log('GET:', {
        'url': this.baseUrl + uri
    });

    request({
        url: this.baseUrl + uri
    }, function(error, response, body) {
        if (error) {
            console.log('ERROR', error);
            deferred.resolve(false);
            return this.promise;
        }

        deferred.resolve(null);
    }.bind(this));

    return this.promise;
};

module.exports = new NationalRail();