import Levels from './Levels.js';

describe('Levels', function () {
    it('Should be defined', function () {
        expect(Levels).toBeDefined();
        expect(Levels.Level).toBeDefined();
        expect(Levels.Level.ERROR).toBeGreaterThan(Levels.Level.INFO);
    });
    describe('getLevels method', function () {
        it('Should return the level value by name', function () {
            expect(Levels.getLevel('verbose')).toBe(Levels.Level.VERBOSE);
            expect(Levels.getLevel('VERBOSE')).toBe(Levels.Level.VERBOSE);
        });
        it('Should return empty string in case of no name', function () {
            expect(Levels.getLevel('')).toBe('');
        });
        it('Should return the parameter value in case of non-string parameter type', function () {
            expect(Levels.getLevel(10)).toBe(10);
        });
    });
    describe('getName method', function () {
        it('Should return the uppercase name by value', function () {
            expect(Levels.getName(Levels.Level.VERBOSE)).toBe('VERBOSE');
            expect(Levels.getName(Levels.Level.DEBUG)).toBe('DEBUG');
        });
    });
});
