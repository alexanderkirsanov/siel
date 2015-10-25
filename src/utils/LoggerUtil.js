import Levels from '../Levels.js';

let Utils = {
    ROOT: 'root',
    DIVIDER: '.',
    __parentNameCache: {},

    getParentNames(name) {
        if (!this.__parentNameCache[name]) {
            let parents = [],
                parts = name.split(this.DIVIDER);
            if (parts.length > 1) {
                while (parts.length > 1) {
                    parts.pop();
                    parents.unshift(parts.join(this.DIVIDER));
                }
                parents.unshift(this.ROOT);
                this.__parentNameCache[name] = parents;
            }
            else {
                this.__parentNameCache[name] = [this.ROOT];
            }
        }
        return this.__parentNameCache[name];
    },

    makeRecord(name, level, message, args){
        return {
            name: name,
            level: Levels[level],
            levelName: level,
            timestamp: new Date(),
            message: message,
            args: args
        };
    }
};
export default Utils;