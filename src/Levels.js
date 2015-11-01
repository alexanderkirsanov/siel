import Utils from './utils/LoggerUtil.js';

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
        let aValue = (typeof value === 'string' || value instanceof String) ? value.toUpperCase() : '';
        return this.Level[String(aValue)] || value;
    },

    getName: function (level) {
        if (!this.tmpLevels) {
            this.tmpLevels = {};
            for (let key of Object.keys(this.Level)) {
                this.tmpLevels[this.Level[key]] = key;
            }
        }
        return this.tmpLevels[level];
    }
};
