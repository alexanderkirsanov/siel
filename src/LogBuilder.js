class LogBuilder {

    config(options) {
        if (options) {
            let {formatters, filters, loggers} = options;
            this.processOption(formatters, this.configureFormatter, options);
            this.processOption(filters, this.configureFilter, options);
            this.processOption(loggers, this.configureLoggers, options);
        }else {
            throw new Error('Logger options should be defined');
        }
    }

    processOption(optionConfig = {}, func, baseOptions) {
        for (let key of Object.keys(optionConfig)) {
            optionConfig[key] = func(optionConfig[key], baseOptions);
        }
    }

    configureLoggers() {

    }

    configureFilter() {

    }

    configureFormatter() {

    }
}
export default LogBuilder;
