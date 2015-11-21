class FormatterUtil {

    static format(pattern, ...params) {
        let formatRegExp = /%[sdj%]/g;
        if (typeof pattern !== 'string') {
            let objects = [];
            for (let i = 0; i < arguments.length; i++) {
                objects.push(JSON.stringify(arguments[i]));
            }
            return objects.join(' ');
        }
        let i = 1;
        let len = params.length;
        let str = String(pattern).replace(formatRegExp, function (x) {
            if (x === '%%') {
                return '%';
            }
            if (i >= len) {
                return x;
            }
            switch (x) {
                case '%s':
                    return String(params[i++]);
                case '%d':
                    return Number(params[i++]);
                case '%j':
                    try {
                        return JSON.stringify(params[i++]);
                    } catch (_) {
                        return '[Circular]';
                    }
                default:
                    return x;
            }
        });

        for (let x = arguments[i]; i < len + 1; x = arguments[++i]) {
            if (x === null || typeof x !== 'object') {
                str += ' ' + x;
            }
        }
        return str;
    }
}
export default FormatterUtil;
