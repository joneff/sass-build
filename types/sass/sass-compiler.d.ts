declare type SassCompiler = {
    build( file: string, outFile: string, sassOptions?: SassOptions ) : void;
    buildFiles( files: string | string[], output: OutputOptions, sassOptions?: SassOptions) : void;
    buildString( source: string, outFile: string, sassOptions?: SassOptions ) : void;
    compile( file: string, sassOptions?: SassOptions ) : string;
    compileString( source: string, sassOptions?: SassOptions ) : string;
    info: string;
}

declare type LegacySassImplementation = {
    renderSync(options: LegacySassOptions): LegacyCompileResult;
    renderSync(options: Omit<LegacySassOptions, 'data'>): LegacyCompileResult;
    logger: SassLogger;
    info: string;
}

declare type ModernSassImplementation = {
    compile( file: string, options: ModernSassOptions ) : ModernCompileResult;
    compileString( source: string, options: ModernSassOptions ): ModernCompileResult;
    logger: SassLogger;
    info: string;
}

declare type NativeSassCompiler = LegacySassImplementation | ModernSassImplementation;
