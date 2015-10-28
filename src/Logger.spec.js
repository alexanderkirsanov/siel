import Logger from './Logger.js';
import Util from './utils/LoggerUtil.js';

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
            //let simpleLogger = Logger.createLogger('siel.test.logger');
            //let specLogger = Logger.createLogger('siel.test.logger.spec');
            expect(customLogger.getSuitableParent('siel.test.logger.custom.Custom')).toBe(customLogger);
        });
    })
});
