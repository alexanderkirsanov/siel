import Filters from './Filters.js';

describe('Filters', () => {
    it('Should be defined', () => {
        expect(Filters).toBeDefined();
    });
    let filters;
    beforeEach(() => {
        filters = new Filters();
    });
    describe('Add filter verification', () => {
        it('Should save all filters in store', () => {
            let fn = ()=> {
            };
            filters.add(fn);
            filters.add(fn);
            expect(filters.getAll().length).toBe(2);
        });
    });
    describe('Remove filter verification', () => {
        it('Should remove filter from store', () => {
            let fn = ()=> {
            };
            filters.add(fn);
            expect(filters.getAll().length).toBe(1);
            filters.remove(fn);
            expect(filters.getAll().length).toBe(0);
        });
        it('Shouldn\'t remove non existing filter', () => {
            let fn = ()=> {
            };
            let fn2 = () => {
            };
            filters.add(fn);
            expect(filters.getAll().length).toBe(1);
            filters.remove(fn2);
            expect(filters.getAll().length).toBe(1);
        });
    });

    describe('Filter verification', () => {
        let trueFn = ()=> {
            return true;
        };
        let falseFn = ()=> {
            return false;
        };
        it('Should return false if at least one filter return false', () => {
            filters.add(trueFn);
            filters.add(trueFn);
            filters.add(falseFn);
            expect(filters.filter()).toBeFalsy();
        });
        it('Should return true if all filters passes the test', () => {
            filters = new Filters();
            filters.add(trueFn);
            filters.add(trueFn);
            expect(filters.filter()).toBeTruthy();
        });

        it('Should pass the record as filter parameter', () => {
            filters = new Filters();
            let test = jasmine.createSpy();
            filters.add(test);
            filters.filter('test');
            expect(test).toHaveBeenCalledWith('test');
        });
    });
});

