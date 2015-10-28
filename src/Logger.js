import Util from './utils/LoggerUtil.js';
import Levels from './Levels.js';
import Handlers from './handlers/Handlers.js';
class Logger {
    static createLogger(name = Util.ROOT) {
        let logger;
        if (!Logger.loggers) {
            Logger.loggers = {};
        }
        if (name in Logger.loggers) {
            logger = Logger.loggers[name];
        } else {
            logger = new Logger(name);
            Logger.loggers[name] = logger;
        }
        return logger;
    }
    static clearCaches() {
        Logger.logger = null
    }

    constructor(name = Util.ROOT) {
        this.name = name;
        this.loggers = {};
        this.handlers = {};
        this.level = null;
        this.propagate = true;
        this.handlers = new Handlers();
    }

    getName(){
        return this.name;
    }

    getSuitableParent(name) {
        let parentNames;
        let parent;
        if (name === Util.ROOT) {
            return null;
        }
        parentNames = Util.getParentNames(name).reverse();
        for (let parentName of parentNames) {
            parent = Logger.loggers[parentName];
            if (parent) {
                break;
            }
        }
        return parent;
    }

    getHandlers() {
        return this.handlers;
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

    handle(record) {
        let promises = [];
        let result;
        if (this.filter(record)) {
            promises = this.handlers.handle(record);
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
