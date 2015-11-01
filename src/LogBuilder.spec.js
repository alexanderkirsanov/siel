import LogBuilder from './LogBuilder.js';
describe('LogBuilder', () => {
    it('Should be defined', () => {
        expect(LogBuilder).toBeDefined();
    });
    describe('It should invoke corresponding configurators for config options', () => {
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
        let loggerBuilder;
        beforeEach(() => {
            loggerBuilder = new LogBuilder();
        });
        it('should invoke processOption method for each configurable option', () => {
            spyOn(loggerBuilder, 'processOption');
            loggerBuilder.config(testConfig);
            expect(loggerBuilder.processOption.calls.count()).toEqual(3);
        });
    });
});
