import Util from './utils/FormatterUtil.js';

class Formatter {
    static compileFormat() {

    }

    constructor(options) {
        this.format = '[%date] %-5level %logger - %message%n%error';
        if (typeof options === 'string' || options instanceof String) {
            this.format = options;
        } else if (typeof value === 'object') {
            if ('format' in options) {
                this.format = options;
            }
        }
        this.compiledFormat = Formatter.compileFormat(this.format);
    }

    format(record) {
        let message = record.message;
        let formatted = Util.format.apply(Util, record.args);

        record.message = formatted;
        formatted = this.compiledFormat(record);

        record.message = message;
        return formatted;
    }
}
export default Formatter;
