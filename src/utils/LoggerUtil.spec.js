import LoggerUtil from './LoggerUtil.js';
import Levels from '../Levels.js';

describe('LoggerUtil', () => {
    it('Should be defined', () => {
        expect(LoggerUtil).toBeDefined();
    });
    describe('getParentNames verification', () => {
        beforeEach(() => {
            LoggerUtil.resetParentNamesCache();
        });
        it('Should return root parent in case of non found', () => {
            expect(LoggerUtil.getParentNames('siel')).toEqual(['root']);
        });
        it('Should return array starts from parent to children starting from root for complex names', () => {
            expect(LoggerUtil.getParentNames('siel.utils.Logger')).toEqual(['root', 'siel', 'siel.utils']);
        });
        it('Should take the parent names from cache', () => {
            const a = LoggerUtil.getParentNames('siel.utils.Logger');
            const b = LoggerUtil.getParentNames('siel.utils.Logger');
            expect(a === b).toBeTruthy();
        });
    });
    describe('Record creation verification', () => {
        const aName = 'name';
        const levelName = 'INFO';
        const aMessage = 'message';
        const anArgs = ['test'];

        it('Should return message object', () => {
            let {name, level, message, timestamp, args} = LoggerUtil.makeRecord(aName, levelName, aMessage, anArgs);
            expect(level).toBe(Levels.getLevel(levelName));
            expect(name).toBe(aName);
            expect(message).toBe(aMessage);
            expect(timestamp).toBeDefined();
            expect(args).toEqual(args);
        });

        it('Should set the current time as timestamp', () => {
            jasmine.clock().install();
            jasmine.clock().mockDate();
            let record = LoggerUtil.makeRecord(aName, levelName, aMessage, anArgs);
            jasmine.clock().tick(5000);
            let record2 = LoggerUtil.makeRecord(aName, levelName, aMessage, anArgs);
            jasmine.clock().uninstall();
            expect(record.timestamp).toBeLessThan(record2.timestamp);
        });
    });
});
