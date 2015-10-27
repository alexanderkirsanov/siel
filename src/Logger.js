import Util from './utils/LoggerUtil.js';
import Levels from './Levels.js';
class Logger {
    constructor(name) {
        if (!name) {
            this.name = Util.ROOT;
        }
        this.loggers = {};
        this.handlers = {};
        this.level = null;
        this.propagate = true;
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

    verbose(message) {
        return this.log(Levels.getName(Levels.Level.VERBOSE), message, arguments);
    }

    debug(message) {
        return this.log(Levels.getName(Levels.Level.DEBUG), message, arguments);
    }

    info(message) {
        return this.log(Levels.getName(Levels.Level.INFO), message, arguments);
    }


    warning(message) {
        return this.log(Levels.getName(Levels.Level.WARNING), message, arguments);
    }


    error(message) {
        return this.log(Levels.getName(Levels.Level.ERROR), message, arguments);
    }

    fatal(message) {
        return this.log(Levels.getName(Levels.Level.FATAL), message, arguments);
    }

    addHandler(handler) {
        this.handlers.push(handler);
        return this;
    }

    removeHandler(handler) {
        let index = this.handlers.indexOf(handler);
        if (index !== -1) {
            this.handlers.splice(index, 1);
        }
        return this;
    }

    getHandlers() {
        return this.handlers;
    }

    handle(record) {
        let promises = [];
        let result;
        if (this.filter(record)) {
            let i = this.handlers.length;
            while (i > 0) {
                i = i - 1;
                if (record.level >= this.handlers[i].level) {
                    promises.push(this.handlers[i].handle(record));
                }
            }
            if (this.isPropagate()) {
                let parent = this.getSuitableParent(this.name);
                if (parent) {
                    promises.push(parent.handle(record));
                }
            }
        }
        if (promises.length > 2) {
            result = Promise.all(promises);
        } else if (promises[0]) {
            result = promises[0];
        } else {
            result = Promise.fulfilled();
        }
        return result;
    }

    setPropagate(isPropagate) {
        this.propagate = isPropagate;
    }

    isPropagate() {
        return this.propagate;
    }

    getSuitableLevel() {
        let result;
        let parent;
        if (this.level !== null) {
            result = this.level;
        } else {
            parent = this.getSuitableParent(this.name);
            if (parent) {
                result = parent.getSuitableLevel();
            } else {
                result = Levels.Level.NO;
            }
        }
        return result;
    }

    setLevel(level) {
        let aLevel = Levels.getLevel(level);
        if (aLevel === null) {
            throw new Error('Cannot set level with provided value:' + level);
        }
        this.level = aLevel;
        return this;
    }

    log(level, msg, ...messages) {
        let args;
        if (arguments.length < 2) {
            args = [];
        } else {
            args = messages;
        }

        return this.internalLog(level, msg, args);
    }

    isEnabledFor(level) {
        return level >= this.getSuitableLevel();
    }

    internalLog(level, msg, args) {
        let promise;
        if (this.isEnabledFor(Levels[level])) {
            promise = this.handle(Util.makeRecord(this.name, level, msg, args));
        } else {
            promise = Promise.fulfilled();
        }
        return promise;
    }
}
export default Logger;
