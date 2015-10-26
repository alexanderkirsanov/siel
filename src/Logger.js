import Util from './utils/LoggerUtil.js';

class Logger {
    constructor() {
        this.loggers = {};
    }

    getSuitableParent(name) {
        let parentNames;
        let i;
        let parent;
        if (name === Util.ROOT) {
            return null;
        }
        parentNames = Util.getParentNames(name);
        i = parentNames.length;
        while (!parent && i > 0) {
            i = i - 1;
            parent = this.loggers[parentNames[i]];
        }
        return parent;
    }

    logAtLevel(level) {
        return msg => {
            return this.log(level, msg, arguments);
        };
    }

    log() {
        //if (this.isEnabledFor(LEVELS[level])) {
        //    promise = this.handle(Util.makeRecord(this._name, level, msg, args));
        //} else {
        //    promise = Promise.fulfilled();
        //}
        //return promise;
    }
}
export default Logger;
