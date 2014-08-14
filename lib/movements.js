var _ = require('underscore')
  , feeds = require('./feeds')
  , reference = require('./reference')
;

var Movements = function() {

};

Movements.prototype.listen = function(callback) {
    feeds.listen(feeds.topics.movements.all, null, function(body, headers) {
        var movements = []
          , movementTypes = {
            '0001': 'activation',
            '0002': 'cancellation',
            '0003': 'movement',
            '0004': null,
            '0005': 'reinstatement',
            '0006': 'change-of-origin',
            '0007': 'change-of-identity',
            '0008': null,
          }

        body.forEach(function(message) {
            var movementType;

            if (!_.has(movementTypes, message.header.msg_type)) {
                return;
            }

            movementType = movementTypes[message.header.msg_type];

            movements.push({
                'trainID': message.body.train_id,
                'type': movementType,
                'company': (_.has(reference.tocCodes, message.body.toc_id)) ? tocCodes[message.body.toc_id].name : null,
                'timestamp': message.body.actual_timestamp,
                'plannedTimestamp': message.body.planned_timestamp,
                'timetableVariation': message.body.timetable_variation,
                'stanox': message.body.loc_stanox,
                'nextStanox': message.body.next_report_stanox
            });
        });

        callback(movements);
    });
};

module.exports = new Movements();