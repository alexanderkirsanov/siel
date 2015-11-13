import Handler from './Handler.js';
import Levels from '../Levels.js';

class Console extends Handler {
    emit(record) {
        let message = this.format(record);
        let Level = Levels.Level;
        /*eslint-disable no-console*/
        switch (this.level) {
            case Level.DEBUG:
                console.log(message);
                break;
            case Level.ERROR:
                console.error(message);
                break;
            case Level.FATAL:
                console.error(message);
                break;
            case Level.INFO:
                console.info(message);
                break;
            case Level.VERBOSE:
                console.log(message);
                break;
            case Level.WARNING:
                console.warn(message);
                break;
            default :
                break;
        }
        /*eslint-enable no-console*/
    }
}
export default Console;
