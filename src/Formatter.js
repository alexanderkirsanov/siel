class Formatter {
    static compileFormat() {

    }

    constructor(options) {
        this.format = '[%date] %-5level %logger - %message%n%error';
        if (typeof value === 'string' || value instanceof String) {
            this.format = options;
        } else if (typeof value === 'object') {
            if ('format' in options) {
                this.format = options;
            }
        }
        Formatter.compileFormat(format);
    }

    format(record) {
        let message = record.message,
            formatted = util.format.apply(util, record.args);

        record.message = formatted;
        formatted = this._compiledFormat(record);

        record.message = message;
        return formatted;
    }
}
export default Formatter;
