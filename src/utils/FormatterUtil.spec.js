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
        it('Should format numbers correctly', () => {
            expect(FormatterUtils.format('%d', 42.0)).toBe('42');
            expect(FormatterUtils.format('%d', 42)).toBe('42');
            expect(FormatterUtils.format('%s', 42)).toBe('42');
            expect(FormatterUtils.format('%j', 42)).toBe('42');
        });
        it('Should format strings correctly', () => {
            expect(FormatterUtils.format('%d', '42.0')).toBe('42');
            expect(FormatterUtils.format('%d', '42')).toBe('42');
            expect(FormatterUtils.format('%s', '42')).toBe('42');
            expect(FormatterUtils.format('%j', '42')).toBe('"42"');
        });
        it('Should format complex patterns well', () => {
            expect(FormatterUtils.format('%%s%s', 'foo')).toBe('%sfoo');
        });

        it('Should stringify non formatted options', () => {
            let o = {test:1};
            expect(FormatterUtils.format('%s', 'foo', o)).toBe('foo {"test":1}');
        });

        it('Should format using the %s patterns well', () => {
            expect(FormatterUtils.format('%s')).toBe('%s');
            expect(FormatterUtils.format('%s', undefined)).toBe('undefined');
            expect(FormatterUtils.format('%s', 'foo')).toBe('foo');
            expect(FormatterUtils.format('%s:%s')).toBe('%s:%s');
            expect(FormatterUtils.format('%s:%s', undefined)).toBe('undefined:%s');
            expect(FormatterUtils.format('%s:%s', 'foo')).toBe('foo:%s');
            expect(FormatterUtils.format('%s:%s', 'foo', 'bar')).toBe('foo:bar');
            expect(FormatterUtils.format('%s:%s', 'foo', 'bar', 'baz')).toBe('foo:bar baz');
            expect(FormatterUtils.format('%%%s%%', 'hi')).toBe('%hi%');
            expect(FormatterUtils.format('%%%s%%%%', 'hi')).toBe('%hi%%');
        });

        it('Should return [Circular] in case of circular', () => {
            let o = {};
            o.o = o;
            expect(FormatterUtils.format('%j', o)).toBe('[Circular]');
        });
    });
});
