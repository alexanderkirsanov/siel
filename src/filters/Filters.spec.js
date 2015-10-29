import Filters from './Filters.js';

describe('Filters', () => {
    it('Should be defined', () => {
        expect(Filters).toBeDefined();
    });
    let filters;
    beforeEach(() => {
        filters = new Filters();
    });
    describe('Add filter verification', function(){
        it('Should save all filters in store', () => {
            filters.addFilter(()=>{});
            filters.addFilter(()=>{});
            expect(filters.getFilters().length).toBe(2);
        });
    });
    describe('Remove filter verification', function(){
        it('Should remove filter from store', () => {
            let fn = ()=>{};
            filters.addFilter(fn);
            expect(filters.getFilters().length).toBe(1);
            filters.removeFilter(fn);
            expect(filters.getFilters().length).toBe(0);
        });
        it('Shouldn\'t remove non existing filter', () => {
            let fn = ()=>{};
            filters.addFilter(fn);
            expect(filters.getFilters().length).toBe(1);
            filters.removeFilter(() => {});
            expect(filters.getFilters().length).toBe(1);
        });
    });

    describe('Filter verification', function(){
        it('Should return false if at least one filter return false', () => {
            filters.addFilter(()=>{return true;});
            filters.addFilter(()=>{return true;});
            filters.addFilter(()=>{return false;});
            expect(filters.filter()).toBeFalsy();
        });
        it('Should return true if all filters passes the test', () => {
            filters = new Filters();
            filters.addFilter(()=>{return true;});
            filters.addFilter(()=>{return true;});
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
