import Logger from './Logger.js';
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
            console.log(error);
        });
    }

    configureLoggers(loggers, options) {
        for (let logger of loggers) {
            this.configureLogger(logger, loggers, options);
        }
    }

    configureFilters() {

    }

    configureFormatters() {

    }

    configureLogger(name, loggerOptions = {}, options = {}) {
        let logger = Logger.createLogger(name);
        if (loggerOptions.level) {
            logger.setLevel(loggerOptions.level);
        }
        let result = new Promise((resolve, reject) => {
            let promises = [];
            if (loggerOptions.handlers) {
                let promise = new Promise((resolve, reject)=> {
                    let count = loggerOptions.handlers.length;
                    loggerOptions.handlers.forEach((name)=> {
                        let handler = options.handlers[name];
                        if (!handler) {
                            reject('There is no handler with name: ' + name);
                        }
                        if (typeof handler.handle !== 'function') {
                            this.configureHandler(handler, options).then((handler)=> {
                                options.handlers[name] = handler.default ? handler.default : handler;
                                logger.getHandlers().add(new options.handlers[name]());
                                count--;
                                if (count === 0) {
                                    resolve();
                                }
                            }).catch((error) => {
                                reject(error);
                            });
                        }
                    })
                });
                promises.push(promise)
            }
            promises.push(new Promise((resolveInner) => {
                if (loggerOptions.filters) {
                    loggerOptions.filters.forEach((filter) => {
                        if (!options[filter]) {
                            throw new Error('There is no filter with name: ' + filter);
                        }
                        logger.getFilters().add(options.filters[filter]);
                    });
                }

                if (loggerOptions.propagate !== null) {
                    logger.propagate = loggerOptions.propagate;
                }
                resolveInner();
            }));
            Promise.all(promises).then(()=> {
                resolve();
            }).catch((err = null)=> {
                reject(err);
            });
        });
        return result;
    }


    configureHandler(handler, options) {
        let HandlerClass = handler['class'];
        delete handler['class'];
        if (typeof HandlerClass === 'string') {
            return System.import(HandlerClass).then((cls)=> {
                return new Promise((resolve)=> {
                    resolve(cls);
                })
            });
        } else {
            return new Promise((resolve) => {
                resolve(HandlerClass);
            })
        }
    }
}
export default LogBuilder;
