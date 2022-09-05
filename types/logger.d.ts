declare type LoggerType = {
    time( label: string ) : void;
    timeEnd( label: string, level?: string, prefix?: string, message?: string, ...args: []) : void | string;
    log( level: string, prefix: string, message: string, ...args: [] ) : void;
    silly( prefix: string, message: string, ...args: [] ) : void;
    debug( prefix: string, message: string, ...args: [] ) : void;
    verbose( prefix: string, message: string, ...args: [] ) : void;
    info( prefix: string, message: string, ...args: [] ) : void;
    warn( prefix: string, message: string, ...args: [] ) : void;
    error( prefix: string, message: string, ...args: [] ) : void;
}
