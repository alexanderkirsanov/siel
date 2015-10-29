class Filters {
    constructor() {
        this.filters = [];
    }

    filter(record) {
        return this.filters.every(filter => {
            return filter(record);
        });
    }

    addFilter(filter) {
        this.filters.push(filter);
        return this;
    }

    getFilters() {
        return this.filters;
    }

    removeFilter(filter) {
        let index = this.filters.indexOf(filter);
        if (index !== -1) {
            this.filters.splice(index, 1);
        }
        return this;
    }
}
export default Filters;
