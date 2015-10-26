import LoggerUtil from './LoggerUtil.js';

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
            let a = LoggerUtil.getParentNames('siel.utils.Logger');
            let b = LoggerUtil.getParentNames('siel.utils.Logger');
            expect(a === b).toBeTruthy();
        });
    });
});
