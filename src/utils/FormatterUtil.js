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
        let i = 0;
        let len = params.length;
        let str = String(pattern).replace(formatRegExp, x=> {
            /*eslint-disable no-plusplus */
            if (x === '%%') {
                return '%';
            }
            if (i >= len) {
                return x;
            }
            let result;
            switch (x) {
                case '%s':
                    result = String(params[i++]);
                    break;
                case '%d':
                    result = Number(params[i++]);
                    break;
                case '%j':
                    try {
                        result = JSON.stringify(params[i++]);
                    } catch (_) {
                        result = '[Circular]';
                    }
                    break;
                default:
                    result = x;
            }
            return result;
            /*eslint-enable no-plusplus */
        });
        i = i + 1;

        for (let n = i; n < len + 1; n++) {
            let x = arguments[n];
            if (x === null || typeof x !== 'object') {
                str = str + ' ' + x;
            } else {
                str = str + ' ' + JSON.stringify(x);
            }
        }

        return str;
    }


}
export default FormatterUtil;
