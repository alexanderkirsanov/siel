import _ from 'underscore';
export default {
    NO: 0,
    VERBOSE: 100,
    DEBUG: 200,
    INFO: 300,
    WARNING: 400,
    ERROR: 500,
    FATAL: 600,

    getLevel: function (value) {
        let aValue = _.isString(value) ? value.toUpperCase() : '';
        return this[String(aValue)] || value;
    }
};
