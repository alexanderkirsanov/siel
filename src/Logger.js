import Util from './utils/LoggerUtil.js';

class Logger {
    constructor() {
        this.__loggers = {};
    }

    getSuitableParent(name) {
        let parentNames,
            i,
            parent;
        if (name === Util.ROOT) {
            return;
        }
        parentNames = Util.getParentNames(name);
        i = parentNames.length;
        while (!parent && i--) {
            parent = this.__loggers[parentNames[i]];
        }
        return parent;
    }

    logAtLevel(level) {
        return msg => {
            return this._log(level, msg, arguments);
        }
    }

    _log(level, msg, args) {
        let promise;
        //if (this.isEnabledFor(LEVELS[level])) {
        //    promise = this.handle(Util.makeRecord(this._name, level, msg, args));
        //} else {
        //    promise = Promise.fulfilled();
        //}
        //return promise;
    }
}
export default Logger;
