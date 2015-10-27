import Levels from '../Levels.js';

let Utils = {
    ROOT: 'root',
    DIVIDER: '.',
    parentNameCache: {},

    resetParentNamesCache: function () {
        this.parentNameCache = {};
    },

    getParentNames: function (name) {
        if (!this.parentNameCache[name]) {
            let parents = [];
            let parts = name.split(this.DIVIDER);
            if (parts.length > 1) {
                while (parts.length > 1) {
                    parts.pop();
                    parents.unshift(parts.join(this.DIVIDER));
                }
                parents.unshift(this.ROOT);
                this.parentNameCache[name] = parents;
            } else {
                this.parentNameCache[name] = [this.ROOT];
            }
        }
        return this.parentNameCache[name];
    },

    makeRecord: function (name, level, message, args) {
        return {
            name: name,
            level: Levels.Level[level],
            levelName: level,
            timestamp: new Date(),
            message: message,
            args: args
        };
    }
};
export default Utils;
