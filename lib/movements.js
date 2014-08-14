var _ = require('underscore')
  , feeds = require('./feeds')
  , reference = require('./reference')
;

var Movements = function() {

};

Movements.prototype.listen = function(callback) {
    feeds.listen(feeds.topics.movements.all, null, function(body, headers) {
        var movements = {
            'activations': [],
            'cancellations': [],
            'movements': [],
            'reinstatements': [],
            'change_of_origin': [],
            'change_of_identity': [],
          }
          , movementTypes = {
            '0001': 'activations',
            '0002': 'cancellations',
            '0003': 'movements',
            '0004': null,
            '0005': 'reinstatements',
            '0006': 'change_of_origin',
            '0007': 'change_of_identity',
            '0008': null,
          }

        body.forEach(function(message) {
            var movementType
              , location;

            if (!_.has(movementTypes, message.header.msg_type)) {
                return;
            }

            movementType = movementTypes[message.header.msg_type];
            location = reference.findLocationByStanox(message.body.loc_stanox);

            console.log(message);

            movements[movementType].push({
                'trainID': message.body.train_id,
                'company': (_.has(reference.tocCodes, message.body.toc_id)) ? tocCodes[message.body.toc_id].name : null,
                'timestamp': message.body.actual_timestamp,
                'timetableVariation': message.body.timetable_variation,
                'location': (location) ? location.NLCDESC : null,
                'locationCode': (location) ? location['3ALPHA'] : null,
                'locationLat': null,
                'locationLon': null,
            });
        });

        callback(movements);
    });
};

module.exports = new Movements();