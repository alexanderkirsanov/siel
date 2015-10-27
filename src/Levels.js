import _ from 'underscore';
export default {
    Level: {
        NO: 0,
        VERBOSE: 100,
        DEBUG: 200,
        INFO: 300,
        WARNING: 400,
        ERROR: 500,
        FATAL: 600
    },

    getLevel: function (value) {
        let aValue = _.isString(value) ? value.toUpperCase() : '';
        return this.Level[String(aValue)] || value;
    },

    getName: function (level) {
        if (!this.tmpLevels) {
            this.tmpLevels = {};
            _.forEach(this.Level, function (value, key) {
                this.tmpLevels[value] = key;
            }, this);
        }
        return this.tmpLevels[level];
    }
};
