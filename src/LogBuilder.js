import Logger from './Logger.js';
import Formatter from './Formatter.js';
import Filter from './filters/Filters.js';

class LogBuilder {

    config(options) {
        let result = [];
        if (options) {
            let {formatters, filters, loggers} = options;
            result.push(this.processOption(formatters, this.configureFormatters, options));
            result.push(this.processOption(filters, this.configureFilters, options));
            result.push(this.processOption(loggers, this.configureLoggers, options));
        } else {
            throw new Error('Logger options should be defined');
        }
        return Promise.all(result);
    }

    processOption(optionConfig = {}, func = null, baseOptions = null) {
        let keys = Object.keys(optionConfig);
        let promises = keys.map((key) => {
            return func.call(this, optionConfig[key], baseOptions);
        });
        return Promise.all(promises).then((result)=> {
            result.forEach((item = []) => {
                Object.keys(item).forEach((key)=> {
                    optionConfig[key] = item[key];
                });
            });
        }).catch((error)=> {
            throw new Error(error);
        });
    }

    configureLoggers(loggers, options) {
        for (let logger of loggers) {
            this.configureLogger(logger, loggers, options);
        }
    }

    configureFilters(filters) {
        let result = new Promise((resolve, reject) => {
            let filterNames = Object.keys(filters);
            let count = filterNames.length;
            filterNames.forEach((name)=> {
                let filter = filters[name];
                if (typeof filter.class === 'string') {
                    result = System.import(filter.class).then((cls)=> {
                        count = count - 1;
                        filters[name] =  cls.default ? new cls.default : new cls;
                        if (count === 0){
                            resolve();
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    count = count - 1;
                    filters[name] =  new Filter(filter);
                    if (count === 0){
                        resolve();
                    }
                }
            });
        });
        return result;
    }

    configureFormatters(formatters) {
        for (let formatter of formatters) {
            formatters[formatter] = new Formatter(formatters[formatter]);
        }
    }

    configureLogger(loggerName, loggerOptions = {}, options = {}) {
        let logger = Logger.createLogger(loggerName);
        if (loggerOptions.level) {
            logger.setLevel(loggerOptions.level);
        }
        let result = new Promise((resolve, reject) => {
            let promises = [];
            if (loggerOptions.handlers) {
                let promise = new Promise((iResolve, iReject)=> {
                    let count = loggerOptions.handlers.length;
                    options.handlers = options.handlers || {};
                    loggerOptions.handlers.forEach((name)=> {
                        let handler = options.handlers[name];
                        if (!handler) {
                            iReject('There is no handler with name: ' + name);
                        }
                        if (typeof handler.handle !== 'function') {
                            this.configureHandler(handler, options).then((currentHandler)=> {
                                options.handlers[name] = currentHandler.default ? currentHandler.default : currentHandler;
                                logger.getHandlers().add(new options.handlers[name](options));
                                count = count - 1;
                                if (count === 0) {
                                    iResolve();
                                }
                            }).catch((error) => {
                                iReject(error);
                            });
                        }
                    });
                });
                promises.push(promise);
            }
            promises.push(new Promise((resolveInner, rejectInner) => {
                if (loggerOptions.filters) {
                    options.filters = options.filters || {};
                    loggerOptions.filters.forEach((filter) => {
                        if (!options.filters[filter]) {
                            rejectInner('There is no filter with name: ' + filter);
                        }
                        logger.getFilters().add(options.filters[filter]);
                    });
                }

                if (loggerOptions.propagate !== null && loggerOptions.propagate !== undefined) {
                    logger.propagate = loggerOptions.propagate;
                }
                resolveInner();
            }));
            Promise.all(promises).then(()=> {
                resolve();
            }).catch((err)=> {
                reject(err);
            });
        });
        return result;
    }


    configureHandler(handler) {
        let HandlerClass = handler.class;
        let result;
        delete handler.class;
        if (typeof HandlerClass === 'string') {
            result = System.import(HandlerClass).then((cls)=> {
                return new Promise((resolve)=> {
                    resolve(cls);
                });
            });
        } else {
            result = new Promise((resolve) => {
                resolve(HandlerClass);
            });
        }
        return result;
    }
}
export default LogBuilder;
