import LoggerUtil from './LoggerUtil.js';
import Levels from '../Levels.js';

describe('LoggerUtil', function () {
    it('Should be defined', function () {
        expect(LoggerUtil).toBeDefined();
    });
    describe('getParentNames verification', function () {
        beforeEach(function () {
            LoggerUtil.resetParentNamesCache();
        });
        it('Should return root parent in case of non found', function () {
            expect(LoggerUtil.getParentNames('siel')).toEqual(['root']);
        });
        it('Should return array starts from parent to children starting from root for complex names', function () {
            expect(LoggerUtil.getParentNames('siel.utils.Logger')).toEqual(['root', 'siel', 'siel.utils']);
        });
        it('Should take the parent names from cache', function () {
            const a = LoggerUtil.getParentNames('siel.utils.Logger');
            const b = LoggerUtil.getParentNames('siel.utils.Logger');
            expect(a === b).toBeTruthy();
        });
    });
    describe('Record creation verification', function () {
        const name = 'name';
        const levelName = 'INFO';
        const message = 'message';
        const args = ['test'];
        it('Should return message object', function () {
            let record = LoggerUtil.makeRecord(name, levelName, message, args);
            expect(record.level).toBe(Levels.getLevel(levelName));
            expect(record.name).toBe(name);
            expect(record.message).toBe(message);
            expect(record.timestamp).toBeDefined();
            expect(record.args).toEqual(args);
        });
        it('Should set the current time as timestamp', function () {
            jasmine.clock().install();
            jasmine.clock().mockDate();
            let record = LoggerUtil.makeRecord(name, levelName, message, args);
            jasmine.clock().tick(5000);
            let record2 = LoggerUtil.makeRecord(name, levelName, message, args);
            jasmine.clock().uninstall();
            expect(record.timestamp).toBeLessThan(record2.timestamp);
        });
    });
});
