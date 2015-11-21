import FormatterUtils from './FormatterUtil.js';

describe('FormaterUtils', () => {
    it('Should be defined', () => {
        expect(FormatterUtils).toBeDefined();
    });
    describe('format verification', () => {
        it('Shoult work correctly with all types of arguments', () => {
            expect(FormatterUtils.format()).toBe('');
            expect(FormatterUtils.format('')).toBe('');
            expect(FormatterUtils.format([])).toBe('[]');
            expect(FormatterUtils.format(null)).toBe('null');
            expect(FormatterUtils.format(true)).toBe('true');
            expect(FormatterUtils.format(false)).toBe('false');
            expect(FormatterUtils.format('test')).toBe('test');
        });
        it('Should work well with several params', () => {
            expect(FormatterUtils.format('foo', 'bar', 'baz')).toBe('foo bar baz')
        });

    });

});
