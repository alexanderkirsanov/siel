import _ from 'lodash';
export default {
    'NO': 0,
    'VERBOSE': 100,
    'DEBUG': 200,
    'INFO': 300,
    'WARNING': 400,
    'ERROR': 500,
    'FATAL': 600,

    getLevel: function (value) {
        value = _.isString(value) ? value.toUpperCase() : '';
        return this[String(value)] || value
    }
}