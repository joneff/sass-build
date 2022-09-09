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


// #region config options
declare type ConfigOptions = {
    extends: string | string[];
    defaults: {
        transform: CliTransformOptions;
        build: CliBuildOptions;
        bundle: CliBundleOptions;
    }
    files: BuildStageEntry[];
    transform: TransformStageEntry[];
    build: BuildStageEntry[];
    bundle: BundleStageEntry[];
}

declare type ConfigStageFileEntry = {
    file: string;
    outFile: string;
}
declare type ConfigStageGlobEntry = {
    entry: string;
    output: OutputOptions;
}
declare type ConfigStageEntry = ConfigStageFileEntry | ConfigStageGlobEntry;

declare type TransformStageEntry = ConfigStageEntry & CliTransformOptions;

declare type BuildStageEntry = ConfigStageEntry & CliBuildOptions;

declare type BundleStageEntry = ConfigStageEntry & CliBundleOptions;
// #endregion

declare module 'sass-build' {
    export function sassCompile(file: string, options?: CliBuildOptions): string;
    export function sassCompileString(source: string, options?: CliBuildOptions): string;
    export function sassBuild(file: string, outFile: string, options?: CliBuildOptions): void;
    export function sassBuildFiles(files: string | string[], output: OutputOptions, options?: CliBuildOptions): void;
    export function sassBuildString(source: string, outFile: string, options?: CliBuildOptions): void;
    export function wrapCompiler(options: CliBuildOptions): SassCompiler;
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
