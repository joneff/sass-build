// #region sass types
declare type SassValue = {};
declare type ModernCustomFunction = (args: SassValue[]) => SassValue;
declare type LegacyCustomFunction = (...args: SassValue[]) => SassValue;
declare type ModernCompileResult = {
    css: string;
}
declare type LegacyCompileResult = {
    css: Buffer;
}
declare type SassLogger = {
    silent: SassLogger;
    warn( message: string, options ) : void;
    debug( message: string, options ) : void;
}
// #endregion

// #region sass options
declare type SharedSassOptions = {
    charset: boolean;
    precision: 10;
    indentType: 'space';
    indentWidth: 4;
    linefeed: 'lf';
    sourceMap: boolean;
    logger: SassLogger;
    verbose: boolean;
    quietDeps: boolean;
}

// #region native sass options
declare type ModernSassOptions = SharedSassOptions & {
    loadPaths: [];
    style: 'expanded' | 'compressed';
    functions: Record<string, ModernCustomFunction>;
    importers: SassImporter[];
}
declare type LegacySassOptions = SharedSassOptions & {
    file: string;
    outFile: string;
    data: string;
    includePaths: [];
    outputStyle: 'expanded' | 'compressed';
    functions: Record<string, LegacyCustomFunction>;
    importer: SassImporter[];
}
// #endregion

declare type SassOptions = {
    file: string;
    outFile: string;
    source: string;
    minify: boolean;
    logger: SassLogger;
    loadPaths: string[];
    functions: Record<string, ModernCustomFunction | LegacyCustomFunction>;
    importers: SassImporter[];
    sourceMap: boolean
};
// #endregion

// #region sass implementation
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

declare type SassImplementation = LegacySassImplementation | ModernSassImplementation;
// #endregion

// #region defaults options
declare type DefaultsOptions = {
    cwd?: string | (() => string);
}
// #endregion

// #region sass importers
declare type PackageImporterOptions = {
    cwd?: string | (() => string)
    nodeModules?: string | (() => string);
}
declare type CacheImporterOptions = {
    cache?: boolean | Set<string>;
}
// #endregion

// #region postcss
declare type PostcssProcessor = {
    version: string;
    process( css: string | { toString() : string}) : { css: string};
};
// #endregion

// #region path data
declare type FileData = {
    mime: string,
    /** The size of the file in bytes. */
    size: number,
    contentHash: string,
    /** The timestamp indicating the creation time of this file. */
    created: Date,
    /** The timestamp indicating the last time this file was accessed. */
    accessed: Date,
    /** The timestamp indicating the last time the file status was changed. */
    changed: Date,
    /** The timestamp indicating the last time this file was modified. */
    modified: Date
}

declare type PathData = FileData & {
    exists: boolean,
    isFile: boolean,
    fullPath: string,
    path: string,
    base: string,
    name: string,
    ext: string
}
// #endregion

// #region sass compiler
declare type OutputOptions = {
    filename: string,
    path: string
}

declare type SassCompiler = {
    build( file: string, outFile: string, sassOptions?: SassOptions ) : void;
    buildFiles( files: string | string[], output: OutputOptions, sassOptions?: SassOptions) : void;
    buildString( source: string, outFile: string, sassOptions?: SassOptions ) : void;
    compile( file: string, sassOptions?: SassOptions ) : string;
    compileString( source: string, sassOptions?: SassOptions ) : string;
    info: string;
}
// #endregion

// #region cli options
declare type CliOptions = {
    cwd: string,
    implementation: string | SassImplementation;
    api: ApiType;
    postcss: false | 'auto' | [] | PostcssProcessor;
    sassOptions: SassOptions;
}

declare type ApiType = 'modern' | 'legacy';

declare type ConfigOptions = CliOptions & {
    extends: string | string[],
    files: ConfigFileEntry[]
}

declare type ConfigStringFileEntry = String;
declare type ConfigSingleFileEntry = CliOptions & {
    file: string;
    outFile: string;
};
declare type ConfigMultipleFilesEntry = CliOptions & {
    files: string | string[];
    output: OutputOptions;
}

declare type ConfigFileEntry = ConfigStringFileEntry | ConfigSingleFileEntry
// #endregion

declare module 'sass-build' {
    export function sassCompile(file: string, options?: CliOptions): string;
    export function sassCompileString(source: string, options?: CliOptions): string;
    export function sassBuild(file: string, outFile: string, options?: CliOptions): void;
    export function sassBuildFiles(files: string | string[], output: OutputOptions, options?: CliOptions): void;
    export function sassBuildString(source: string, outFile: string, options?: CliOptions): void;
    export function wrapCompiler(options: CliOptions): SassCompiler;
    export class Logger implements LoggerType {
        time(label: string): void;
        timeEnd(label: string, level?: string, prefix?: string, message?: string): string | void;
        log( level: string, prefix: string, message: string, ...args: [] ) : void;
        silly(prefix: string, message: string): void;
        debug(prefix: string, message: string): void;
        verbose(prefix: string, message: string): void;
        info(prefix: string, message: string): void;
        warn(prefix: string, message: string): void;
        error(prefix: string, message: string): void;
    }
}
