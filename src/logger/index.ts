import npmlog from 'npmlog';

const msSecond = 1000;
const msMinute = 60 * msSecond;
const msHour = 60 * msMinute;

function formatTime(ms : number) {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = ms;
    let result : string;

    function _pad(num: number) : string {
        return `${num}`.padStart(2, '0');
    }

    if (milliseconds >= msSecond) {
        if (milliseconds >= msMinute) {
            if (milliseconds >= msHour) {
                hours = Math.floor(milliseconds / msHour);
                milliseconds = milliseconds % msHour;
            }
            minutes = Math.floor(milliseconds / msMinute);
            milliseconds = milliseconds % msMinute;
        }
        seconds = Math.floor(milliseconds / msSecond);
        milliseconds = milliseconds % msSecond;
    }

    if (hours !== 0 || minutes !== 0) {
        result = hours !== 0 ? `${hours}:${_pad(minutes)}` : `${minutes}`;
        return `${result}:${_pad(seconds)}.${milliseconds} (${hours !== 0 ? 'h:m' : ''}m:ss.mmm)`;
    }

    if (seconds !== 0) {
        result = seconds.toFixed(3);
        return `${result}s`;
    }

    result = milliseconds.toFixed(3);
    return `${result}ms`;
}

export class Logger implements LoggerType {
    private times = new Map<string, [number, number]>();
    private logger = npmlog;
    private levels : string[] = [];

    constructor(options? : { level?: string } ) {
        this.level = options?.level || 'info';
    }

    get level() : string {
        return this.logger.level;
    }
    set level( level: string ) {
        this.logger.level = level;
    }

    time( label?: string ) : void {

        if (label === undefined) {
            // eslint-disable-next-line no-param-reassign
            label = '';
        }

        if (this.times.has(label)) {
            this.warn( 'time', 'Time label "%s" already exists.', label );
            return;
        }

        this.times.set(label, process.hrtime());
    }

    // eslint-disable-next-line max-params
    timeEnd(label: string, level?: string, prefix?: string, message?: string, ...args: []): void | string {

        if (label === undefined) {
            // eslint-disable-next-line no-param-reassign
            label = '';
        }

        if (this.times.has(label) === false) {
            this.warn( 'time', 'Time label "%s" does not exist.', label );
            return;
        }

        const time = this.times.get(label);
        const duration = process.hrtime(time);
        const ms = duration[0] * 1000 + duration[1] / 1e6;

        const formatted = formatTime(ms);

        this.times.delete(label);

        if (level !== undefined) {
            this.log( level, prefix, message, ...args);
        }

        // eslint-disable-next-line consistent-return
        return formatted;
    }

    subdue( level: string ) : void {
        this.levels.push( this.level );
        this.level = level;
    }
    awaken() : void {
        if (this.levels.length === 0) {
            return;
        }
        this.level = <string> this.levels.pop();
    }

    get amend() {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(1);
        return this;
    }

    log( level: string, prefix: string, message: string, ...args: [] ) : void {
        this.logger.log( level, prefix, message, ...args);
    }
    silly( prefix: string, message: string, ...args : any[] ) : void {
        this.logger.silly( prefix, message, ...args );
    }
    debug( prefix: string, message: string, ...args : any[] ) : void {
        this.logger.debug( prefix, message, ...args );
    }
    verbose( prefix: string, message: string, ...args : any[] ) : void {
        this.logger.verbose( prefix, message, ...args );
    }
    info( prefix: string, message: string, ...args : any[] ) : void {
        this.logger.info( prefix, message, ...args );
    }
    warn( prefix: string, message: string, ...args : any[] ) : void {
        this.logger.warn( prefix, message, ...args );
    }
    error( prefix: string, message: string, ...args : any[] ) : void {
        this.logger.error( prefix, message, ...args );
    }
}
// #endregion
