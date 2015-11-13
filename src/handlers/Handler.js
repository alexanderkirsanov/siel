import Levels from '../Levels.js';

class Handler {
    static add(item) {
        Handler.all = Handler.all || [];
        Handler.all.push(item);
        this.filters = new Filters();
        this.formatter = new DefaultFormatter();
    }

    static removeAll() {
        Handler.all = [];
    }

    constructor(options) {
        if (typeof  options !== 'object') {
            options = {level: options};
        }
        let level = options.level ? Levels.getLevel(options.level) : Levels.Level.NO;
        this.setLevel(level);
        if (options.formatter) {
            this.setFormatter(options.formatter);
        } else if (options.format) {
            this.setFormatter(new DefaultFormatter(options.format));
        }

    }

    getFilters() {
        return this.filters;
    }

    iEmit(...args) {
        return new Promise((resolve) => {
            resolve(this.emit.apply(this, args));
        });
    }

    handle(record) {
        if (!this.filters.filter(record)) {
            return Promise.fulfilled();
        }
        if (this.emit.length < 2) {
            throw new Error('Handler.emit requires a callback argument');
        }

        return this.iEmit(record);
    }

    format(record) {
        return this.formatter.format(record);
    }

    setFormatter(formatter) {
        this.formatter = formatter;
        return this;
    }

    setLevel(level) {
        this.level = level;
        return this;
    }
}
export default Handler;