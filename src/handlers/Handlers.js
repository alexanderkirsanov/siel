class Handlers {
    constructor() {
        this.handlers = [];
    }

    addHandler(handler) {
        this.handlers.push(handler);
        return this;
    }

    removeHandler(handler) {
        let index = this.handlers.indexOf(handler);
        if (index !== -1) {
            this.handlers.splice(index, 1);
        }
        return this;
    }

    getHandlers() {
        return this.handlers;
    }

    handle(record) {
        let promises = this.handlers.filter(handler => record.level >= handler.level).reverse().map(handler =>
            handler.handle(record));
        return promises;
    }
}
export default Handlers;
