import Util from './utils/FormatterUtil.js';
const SPACE_PADDING = new Array(1000).join(' ');
const STRING_ESCAPES = {
    '\\': '\\',
    '\'': '\'',
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};
class Formatter {
    static pad(str, value) {
        let isRight = false;

        if (value < 0) {
            isRight = true;
            value = -value;
        }

        if (str.length < value) {
            let padding = SPACE_PADDING.slice(0, value - str.length);
            return isRight ? str + padding : padding + str;
        } else {
            return str;
        }
    }

    static trunc(str, value) {
        if(value > 0) {// truncate from begining
            return str.substring(value - 1);
        } else {// truncate from end
            return str.substring(0, -value);
        }
    }

    static escapeStringChar(match) {
        return '\\' + STRING_ESCAPES[match];
    }

    static formatError(err, depth) {
        switch(depth){
            case 'full':
                depth = 1e10;
                break;

            case 'short':
                depth = 1;
                break;

            default:
                if(typeof depth !== 'number') {
                    depth = 1e10;
                }
        }
        let trace = err.stack.substr(err.stack.indexOf('\n') + 1).split('\n');
        let out = err.name + ': ' + err.message + EOL;

        for(let i = 0, len = Math.min(trace.length, depth); i < len; i++) {
            out += trace[i] + EOL;
        }
        return out;
    }

    static compileFormat(text, defaultDateFormat = '%Y/%m/%d %H:%M:%S.%L') {
        const RE = /%(-?\d+)?(\.-?\d+)?(\w+)(?:{([a-zA-Z0-9 ,:\-/\\%]+)})?/g;
        if (!Formatter.formatCache) {
            Formatter.formatCache = {};
        }
        if (Formatter.formatCache[text]) {
            return Formatter.formatCache[text];
        }
        let source = '__p + = \'',
            index = 0,
            dateFormats = [],
            argumentKeys = ['trunc', 'pad', 'formatError'],
            argumentValues = [Formatter.trunc, Formatter.pad, Formatter.formatError];

        text.replace(RE, function (match, pad, trunc, name, args, offset) {
            // escape characters that cannot be included in string literals
            source += text.slice(index, offset)
                .replace(reUnescapedString, escapeStringChar);

            let replaceVal = '';
            switch (name) {
                case '%':
                    replaceVal = '\'%\'';
                    break;

                case 'c':
                case 'lo':
                case 'logger':
                    replaceVal = 'rec.name';
                    break;

                case 'p':
                case 'le':
                case 'level':
                    replaceVal = 'rec.levelname';
                    break;

                case 'd':
                case 'date':
                    let dateName = 'dateFormat' + dateFormats.length;
                    argumentKeys.push(dateName);
                    dateFormats.push(compileTimestamp(args || defaultDateFormat));
                    replaceVal = '__' + dateName + '(rec.timestamp)';
                    break;

                case 'i':
                    replaceVal = 'rec.i';
                    break;

                case 'm':
                case 'msg':
                case 'message':
                    replaceVal = 'rec.message';
                    break;

                case 'n':
                    replaceVal = '\'' + EOL
                            .replace(reUnescapedString, escapeStringChar) + '\'';
                    break;

                case 'err':
                case 'error':
                    replaceVal = '(rec.err ? __formatError(rec.err, \'' + args + '\'): \'\')';
                    break;

                default:
                    replaceVal = '\'\'';
            }

            replaceVal = trunc ? 'this.trunc(' + replaceVal + ',' + trunc + ')'
                : replaceVal;

            replaceVal = pad ? 'this.pad(' + replaceVal + ',' + pad + ')'
                : replaceVal;

            source += '\' +\n' + replaceVal + ' +\n\'';

            index = offset + match.length;

            return match;
        });
        source += text.substr(index).replace(reUnescapedString, escapeStringChar) + '\';\n';
        source = 'function(rec) {\n' +
            'var ' + argumentKeys.map(function (a) {
                return '' + a + ' = ' + 'this.' + a;
            }).join(', ') + ', __p = \'\';\n' +
            source +
            'return __p;\n}';
        var result;
        try {
            result = Function(argumentKeys, 'return ' + source)
                .apply(Formatter, argumentValues.concat(dateFormats));
        } catch (e) {
            e.source = source;
            throw e;
        }

        result.source = source;

        Formatter.formatCache[text] = result;
        return result;
    }

    constructor(options) {
        this.format = '[%date] %-5level %logger - %message%n%error';
        if (typeof options === 'string' || options instanceof String) {
            this.format = options;
        } else if (typeof value === 'object') {
            if ('format' in options) {
                this.format = options;
            }
        }
        this.compiledFormat = Formatter.compileFormat(this.format);
    }

    format(record) {
        let message = record.message;
        let formatted = Util.format.apply(Util, record.args);

        record.message = formatted;
        formatted = this.compiledFormat(record);

        record.message = message;
        return formatted;
    }
}
export default Formatter;
