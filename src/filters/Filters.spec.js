import Filters from './Filters.js';

describe('Filters', () => {
    it('Should be defined', () => {
        expect(Filters).toBeDefined();
    });
    let filters;
    beforeEach(() => {
        filters = new Filters();
    });
    describe('Add filter verification', function () {
        it('Should save all filters in store', () => {
            let fn = ()=> {
            };
            filters.addFilter(fn);
            filters.addFilter(fn);
            expect(filters.getFilters().length).toBe(2);
        });
    });
    describe('Remove filter verification', function () {
        it('Should remove filter from store', () => {
            let fn = ()=> {
            };
            filters.addFilter(fn);
            expect(filters.getFilters().length).toBe(1);
            filters.removeFilter(fn);
            expect(filters.getFilters().length).toBe(0);
        });
        it('Shouldn\'t remove non existing filter', () => {
            let fn = ()=> {
            };
            let fn2 = () => {
            };
            filters.addFilter(fn);
            expect(filters.getFilters().length).toBe(1);
            filters.removeFilter(fn2);
            expect(filters.getFilters().length).toBe(1);
        });
    });

    describe('Filter verification', function () {
        let trueFn = ()=> {
            return true;
        };
        let falseFn = ()=> {
            return false;
        };
        it('Should return false if at least one filter return false', () => {
            filters.addFilter(trueFn);
            filters.addFilter(trueFn);
            filters.addFilter(falseFn);
            expect(filters.filter()).toBeFalsy();
        });
        it('Should return true if all filters passes the test', () => {
            filters = new Filters();
            filters.addFilter(trueFn);
            filters.addFilter(trueFn);
            expect(filters.filter()).toBeTruthy();
        });

        it('Should pass the record as filter parameter', () => {
            filters = new Filters();
            let test = jasmine.createSpy();
            filters.addFilter(test);
            filters.filter('test');
            expect(test).toHaveBeenCalledWith('test');
        });
    });
});

