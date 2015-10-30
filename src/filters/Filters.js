class Filters {
    constructor() {
        this.filters = [];
    }

    filter(record) {
        return this.filters.every(filter => {
            return filter(record);
        });
    }

    add(filter) {
        this.filters.push(filter);
        return this;
    }

    getAll() {
        return this.filters;
    }

    remove(filter) {
        let index = this.filters.indexOf(filter);
        if (index !== -1) {
            this.filters.splice(index, 1);
        }
        return this;
    }
}
export default Filters;
