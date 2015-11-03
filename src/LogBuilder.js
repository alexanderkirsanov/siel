class LogBuilder {

    config(options) {
        let result = [];
        if (options) {
            let {formatters, filters, loggers} = options;
            result.push(this.processOption(formatters, this.configureFormatter, options));
            result.push(this.processOption(filters, this.configureFilter, options));
            result.push(this.processOption(loggers, this.configureLoggers, options));
        } else {
            throw new Error('Logger options should be defined');
        }
        return Promise.all(result);
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
