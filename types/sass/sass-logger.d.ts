declare type SassLogger = {
    silent: SassLogger;
    warn( message: string, options ) : void;
    debug( message: string, options ) : void;
}
