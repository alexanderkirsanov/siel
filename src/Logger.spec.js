import Logger from './Logger.js';
import Levels from './Levels.js';
import Util from './utils/LoggerUtil.js';
import Handlers from './handlers/Handlers.js';
import Filters from './filters/Filters.js';

describe('Logger', () => {
    it('Should be defined', () => {
        expect(Logger).toBeDefined();
    });
    beforeEach(()=> {
        Logger.clearCaches();
    });
    describe('createLogger verification', () => {
        it('Should create new logger based on name', () => {
            const name = 'test';
            let logger = Logger.createLogger(name);
            expect(logger.getName()).toBe(name);
        });

        it('Should create new logger using constructor', () => {
            let logger = new Logger();
            expect(logger.getName()).toBe(Util.ROOT);
        });

        it('Should use caches in case of loggers with same name', () => {
            const name = 'test';
            let logger = Logger.createLogger(name);
            let logger2 = Logger.createLogger(name);
            expect(logger).toBe(logger2);
        });

        it('Should use the root as default logger name', () => {
            let logger = Logger.createLogger();
            expect(logger.getName()).toBe(Util.ROOT);
        });
    });
    describe('get suitable parent verification', () => {
        it('Should return null in case of root logger', () => {
            let logger = Logger.createLogger();
            expect(logger.getSuitableParent(Util.ROOT)).toBeNull();
        });
        it('Should return the nearest parent logger', () => {
            let customLogger = Logger.createLogger('siel.test.logger.custom');
            let simpleLogger = Logger.createLogger('siel.test.logger');
            let specLogger = Logger.createLogger('siel.test.logger.spec');
            expect(customLogger.getSuitableParent('siel.test.logger.custom.Custom')).toBe(customLogger);
            expect(customLogger.getSuitableParent('siel.test.logger.custom.test.Custom')).toBe(customLogger);
            expect(simpleLogger.getSuitableParent('siel.test.logger.test.Custom')).toBe(simpleLogger);
            expect(customLogger.getSuitableParent('siel.test.logger.spec.Spec')).toBe(specLogger);
        });
    });
    describe('getHandlers verification', () => {
        it('Should return the handlers', () => {
            let handlers = Logger.createLogger().getHandlers();
            expect(handlers).toBeDefined();
            expect(handlers).toEqual(jasmine.any(Handlers));
        });
    });
    describe('getFilters verification', () => {
        it('Should return the filters', () => {
            let filters = Logger.createLogger().getFilters();
            expect(filters).toBeDefined();
            expect(filters).toEqual(jasmine.any(Filters));
        });
    });
    describe('logger methods verification', () => {
        let logger;
        beforeEach(()=> {
            logger = Logger.createLogger();
            spyOn(logger, 'internalLog');
        });
        it('verbose should log with verbose level', () => {
            logger.verbose('test');
            expect(logger.internalLog).toHaveBeenCalledWith('VERBOSE', 'test', []);
        });
        it('debug should log with debug level', () => {
            logger.debug('test');
            expect(logger.internalLog).toHaveBeenCalledWith('DEBUG', 'test', []);
        });
        it('info should log with info level', () => {
            logger.info('test');
            expect(logger.internalLog).toHaveBeenCalledWith('INFO', 'test', []);
        });
        it('warning should log with warning level', () => {
            logger.warning('test');
            expect(logger.internalLog).toHaveBeenCalledWith('WARNING', 'test', []);
        });
        it('error should log with error level', () => {
            logger.error('test');
            expect(logger.internalLog).toHaveBeenCalledWith('ERROR', 'test', []);
        });
        it('fatal should log with fatal level', () => {
            logger.fatal('test');
            expect(logger.internalLog).toHaveBeenCalledWith('FATAL', 'test', []);
        });
        it('log should log extra parameters as args if args count more then two', () => {
            logger.log('level', 'message', 'test', 'test2');
            expect(logger.internalLog).toHaveBeenCalledWith('level', 'message', ['test', 'test2']);
        });
        it('log should log empty array as extra arguments if the args count lesser than two', () => {
            logger.log('level', 'message');
            expect(logger.internalLog).toHaveBeenCalledWith('level', 'message', []);
        });
        it('log should log empty array as extra arguments if no args', () => {
            logger.log();
            /*eslint-disable no-undefined*/
            expect(logger.internalLog).toHaveBeenCalledWith(undefined, undefined, []);
            /*eslint-enable no-undefined*/
        });
    });
    describe('getSuitable level verification', () => {
        it('Should return no in case of no level and no suitable parent', () => {
            let logger = Logger.createLogger();
            expect(logger.getSuitableLevel()).toBe(Levels.Level.NO);
        });
        it('Should return current logger level if it is set', () => {
            let logger = Logger.createLogger();
            logger.setLevel(Levels.Level.INFO);
            expect(logger.getSuitableLevel()).toBe(Levels.Level.INFO);
        });

        it('Should return parent logger level if there is no logger level in current logger', () => {
            let logger = Logger.createLogger('siel');
            let logger1 = Logger.createLogger('siel.test');
            logger.setLevel(Levels.Level.INFO);
            expect(logger1.getSuitableLevel()).toBe(Levels.Level.INFO);
        });
        it('Should return the nearest parent logger level if there is no logger level in current logger', () => {
            let logger = Logger.createLogger('siel');
            let logger1 = Logger.createLogger('siel.test.test');
            let logger2 = Logger.createLogger('siel.test.test.test');
            logger.setLevel(Levels.Level.INFO);
            logger1.setLevel(Levels.Level.ERROR);
            expect(logger2.getSuitableLevel()).toBe(Levels.Level.ERROR);
        });
    });
    describe('levels verification', () => {
        it('Set level should normally processes a correct level', () => {
            let logger = Logger.createLogger();
            logger.setLevel(Levels.Level.INFO);
            expect(logger.getSuitableLevel()).toBe(Levels.Level.INFO);
        });
        it('Set level should throw exception in case of incorrect level', () => {
            let testFunc = () => {
                let logger = Logger.createLogger();
                logger.setLevel(null);
            };
            expect(testFunc).toThrowError();
        });
        it('Should return true if suitable level is not greater than parameter', () => {
            let logger = Logger.createLogger();
            logger.setLevel(Levels.Level.INFO);
            expect(logger.isEnabledFor(Levels.Level.WARNING)).toBeTruthy();
            expect(logger.isEnabledFor(Levels.Level.INFO)).toBeTruthy();
        });

        it('Should return false if suitable level is greater than parameter', () => {
            let logger = Logger.createLogger();
            logger.setLevel(Levels.Level.INFO);
            expect(logger.isEnabledFor(Levels.Level.DEBUG)).toBeFalsy();
        });
    });
    describe('propagation verification', () => {
        it('Should be propagated by default', () => {
            let logger = Logger.createLogger();
            expect(logger.isPropagate()).toBeTruthy();
        });
        it('Should return the actual propagation status', () => {
            let logger = Logger.createLogger();
            logger.setPropagate(false);
            expect(logger.isPropagate()).toBeFalsy();
            logger.setPropagate(true);
            expect(logger.isPropagate()).toBeTruthy();
        });
    });
    describe('propagation verification', () => {
        it('Should be propagated by default', () => {
            let logger = Logger.createLogger();
            expect(logger.isPropagate()).toBeTruthy();
        });
        it('Should return the actual propagation status', () => {
            let logger = Logger.createLogger();
            logger.setPropagate(false);
            expect(logger.isPropagate()).toBeFalsy();
            logger.setPropagate(true);
            expect(logger.isPropagate()).toBeTruthy();
        });
    });
    describe('internal log verification', () => {
        it('Should invoke handle method which returns promise if it\'s enabled for this level', () => {
            let logger = Logger.createLogger();
            spyOn(logger, 'isEnabledFor').and.returnValue(true);
            spyOn(logger, 'handle').and.returnValue(new Promise(()=> {
            }));
            expect(logger.internalLog('test', 'test', [])).toEqual(jasmine.any(Promise));
            expect(logger.handle).toHaveBeenCalledWith(jasmine.any(Object));
        });
        it('Should return fulfilled promise if it is not enabled for this level', (done) => {
            let logger = Logger.createLogger();
            spyOn(logger, 'isEnabledFor').and.returnValue(false);
            let promise = logger.internalLog('test', 'test', []);
            expect(promise).toEqual(jasmine.any(Promise));
            promise.then(()=> {
                done();
            });
        });
    });
    describe('handle record verification', () => {
        it('Should return resolved promise if record is not handled', (done) => {
            Logger.clearCaches();
            let logger = Logger.createLogger();
            logger.getFilters().add(()=> {
                return false;
            });
            logger.handle().then(()=> {
                done();
            })
        });
        it('Should invoke handlers handle method', (done) => {
            Logger.clearCaches();
            let logger = Logger.createLogger();
            logger.getFilters().add(()=> {
                return true;
            });
            let handler = {
                level: 100,
                handle(record){
                }
            }
            spyOn(handler, 'handle').and.returnValue(new Promise((resolve) => {
                resolve('test');
            }));
            logger.getHandlers().add(handler);
            logger.handle({level: 100}).then((result)=> {
                expect(handler.handle).toHaveBeenCalled();
                expect(result).toBe('test');
                done();
            })
        });
        it('Should invoke parents logger handle method', (done) => {
            Logger.clearCaches();
            let parentLogger = Logger.createLogger('parent');
            parentLogger.getFilters().add(()=> {
                return true;
            });
            let parentHandler = {
                level: 100,
                handle(record){
                }
            }
            spyOn(parentHandler, 'handle').and.returnValue(new Promise((resolve) => {
                resolve('parent');
            }));
            parentLogger.getHandlers().add(parentHandler);

            let logger = Logger.createLogger('parent.child');
            logger.getFilters().add(()=> {
                return true;
            });
            let childHandler = {
                level: 100,
                handle(record){
                }
            }

            spyOn(childHandler, 'handle').and.returnValue(new Promise((resolve) => {
                resolve('child');
            }));
            logger.getHandlers().add(childHandler);

            logger.handle({level: 100}).then((result)=> {
                expect(childHandler.handle).toHaveBeenCalled();
                expect(parentHandler.handle).toHaveBeenCalled();
                expect(result).toEqual(['child', 'parent']);
                done();
            })
        });
    });
});
