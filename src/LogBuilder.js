class LogBuilder {

    config(options) {
        if (options) {
            let {formatters, filters, loggers} = options;
            this.processOption(formatters, this.configureFormatter, options);
            this.processOption(filters, this.configureFilter, options);
            this.processOption(loggers, this.configureLoggers, options);
        } else {
            throw new Error('Logger options should be defined');
        }
    }

    processOption(optionConfig = {}, func, baseOptions) {
        let keys = Object.keys(optionConfig);
        let promises = keys.map((key) => {
            return func(optionConfig[key], baseOptions);
        });
        return Promise.all(promises).then((result)=> {
            result.forEach((item) => {
                Object.keys(item).forEach((key)=> {
                    optionConfig[key] = item[key];
                });
            });
        });
    }

    configureLoggers() {

    }

    configureFilter() {

    }

    configureFormatter() {

    }
}
export default LogBuilder;
