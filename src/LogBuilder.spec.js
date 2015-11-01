import LogBuilder from './LogBuilder.js';
describe('LogBuilder', () => {
    let testConfig = {
        formatters: {
            formatter1: {conf: '1'},
            formatter2: {conf: '1'}
        },
        filters: {
            filter1: {conf: '1'},
            filter2: {conf: '2'}
        },
        loggers: {
            log1: {conf: '1'}
        }
    };
    it('Should be defined', () => {
        expect(LogBuilder).toBeDefined();
    });
    it('Logger shouldn\'t be configured without the options', () => {
        let logBuilder = new LogBuilder();

        let func = () => {
            logBuilder.config();
        };
        expect(func).toThrowError();
    });
    describe('It should invoke corresponding configurators for config options', () => {
        let logBuilder;
        beforeEach(() => {
            logBuilder = new LogBuilder();
        });
        it('should invoke processOption method for each configurable option', () => {
            spyOn(logBuilder, 'processOption');
            logBuilder.config(testConfig);
            expect(logBuilder.processOption.calls.count()).toEqual(3);
        });
    });
    describe('Process option verification', () => {
        let tst;
        let logBuilder = new LogBuilder();
        beforeEach(()=> {
            tst = {
                test() {
                }
            };
        });
        it('Should invoke the func function for each key in option and replace the value by result', () => {
            let options = {
                filter1: {conf: '1'},
                filter2: {conf: '2'}
            };
            spyOn(tst, 'test');
            logBuilder.processOption(options, tst.test, testConfig);
            expect(tst.test.calls.count()).toEqual(2);
        });
        it('Should pass the options value and base options as function parameters', () => {
            let options = {
                filter1: {conf: '1'}
            };
            spyOn(tst, 'test').and.returnValue({conf: '1'});
            logBuilder.processOption(options, tst.test, testConfig);
            expect(tst.test.calls.mostRecent().args[0]).toEqual(options.filter1);
            expect(tst.test.calls.mostRecent().args[1]).toEqual(testConfig);
        });
        it('Should change the original value by function result', () => {
            let options = {
                filter1: {conf: '1'}
            };
            logBuilder.processOption(options, () => {
                return {conf: 2};
            }, testConfig);
            expect(options.filter1).toEqual({conf: 2});
        });
    });
});
