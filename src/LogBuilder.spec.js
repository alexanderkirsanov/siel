import LogBuilder from './LogBuilder.js';
import Logger from './Logger.js';
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
            spyOn(tst, 'test').and.returnValue(new Promise((resolve) => {
                resolve({conf: '1'});
            }));
            logBuilder.processOption(options, tst.test, testConfig);
            expect(tst.test.calls.mostRecent().args[0]).toEqual(options.filter1);
            expect(tst.test.calls.mostRecent().args[1]).toEqual(testConfig);
        });
        it('Should change the original value by function result', (done) => {
            let options = {
                filter1: {conf: '1'}
            };
            logBuilder.processOption(options.filter1, () => {
                return new Promise((resolve) => {
                    resolve({conf: 2});
                });
            }, testConfig).then(()=> {
                expect(options.filter1).toEqual({conf: 2});
                done();
            });
        });
    });
    describe('Configure logger verification', () => {
        beforeEach(()=> {
            Logger.clearCaches();
        });
        let logBuilder = new LogBuilder();
        it('Should be defined', ()=> {
            expect(logBuilder.configureLogger).toBeDefined();
        });
        it('Should return the promise', () => {
            expect(logBuilder.configureLogger()).toEqual(jasmine.any(Promise));
        });
        it('Should load handlers by name using the system js', (done) => {
            logBuilder.configureLogger('test',
                {
                    handlers: [
                        'console'
                    ]
                },
                {
                    handlers: {
                        console: {class: './base/src/handlers/Console.js'}
                    }
                }).then(()=> {
                    expect(Logger.createLogger('test').getHandlers().getAll().length).toBe(1);
                    done();
                }
            );
        });
        it('Should load handlers object', (done) => {
            logBuilder.configureLogger('test',
                {
                    handlers: [
                        'console'
                    ]
                },
                {
                    handlers: {
                        console: {class:function test(){}}
                    }
                }).then(()=> {
                    expect(Logger.createLogger('test').getHandlers().getAll().length).toBe(1);
                    done();
                }
            );
        });
        it('Should invoke the error in case of non existing handler', (done) => {
            logBuilder.configureLogger('test',
                {
                    handlers: [
                        'console'
                    ]
                },
                {}).catch((error)=> {
                    expect(error).toEqual('There is no handler with name: console');
                    done();
                }
            );
        });
        it('Should invoke the error in case of non existing filter', (done) => {
            logBuilder.configureLogger('test',
                {
                    filters: [
                        'simple'
                    ]
                },
                {}).catch((error)=> {
                    expect(error).toEqual('There is no filter with name: simple');
                    done();
                }
            );
        });
        it('Should use filters from config', (done) => {
            logBuilder.configureLogger('test',
                {
                    filters: [
                        'simple'
                    ]
                },
                {
                    filters: {
                        simple: () => {return true;}
                    }
                }).then(()=> {
                    expect(Logger.createLogger('test').getFilters().getAll().length).toBe(1);
                    done();
                }
            );
        });
    });
});
