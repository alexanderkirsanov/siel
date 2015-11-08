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

    processOption(optionConfig = {}, func, baseOptions) {
        let keys = Object.keys(optionConfig);
        let promises = keys.map((key) => {
            return func.call(this, optionConfig[key], baseOptions);
        });
        return Promise.all(promises).then((result)=> {
            result.forEach((item) => {
                Object.keys(item).forEach((key)=> {
                    optionConfig[key] = item[key];
                });
            });
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

    configureLogger(name, loggerOptions, options) {
        let logger = Logger.createLogger(name);
        if (loggerOptions.level !== null) {
            logger.setLevel(loggerOptions.level);
        }
        const self = this;
        let result = new Promise((resolve, reject) => {
            let promises = [];
            if (loggerOptions.handlers) {
                logger.getHandlers().add();
                promises.push.apply(promises, Promise.all(loggerOptions.handlers.map((handlerName) => {
                    return self.initHandler(handlerName, options);
                })));
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
            }).catch((err)=> {
                reject(err);
            });
        });
        return result;
    }

    initHandler(name, options) {
        let handler = options.handlers[name];
        if (!handler) {
            throw new Error('There is no handler with name: ' + name);
        }
        if (typeof handler.handle !== 'function') {
            handler = options.handlers[name] = this.configureHandler(handler, options);
        }
        return handler;
    }

    configureHandler(handler, options) {

    }
}
export default LogBuilder;
