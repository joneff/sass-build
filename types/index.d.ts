/// <reference path="build/index.d.ts" />
/// <reference path="cli/index.d.ts" />
/// <reference path="compile/index.d.ts" />
/// <reference path="compiler/index.d.ts" />
/// <reference path="config/index.d.ts" />
/// <reference path="importers/index.d.ts" />
/// <reference path="logger/index.d.ts" />
/// <reference path="output/index.d.ts" />
/// <reference path="postcss/index.d.ts" />
/// <reference path="sass/index.d.ts" />
/// <reference path="transform/index.d.ts" />
/// <reference path="transformer/index.d.ts" />
/// <reference path="types.d.ts" />


declare module 'sass-build' {
    export function sassCompile(file: string, options?: SassCompilerOptions): string;
    export function sassCompileString(source: string, options?: SassCompilerOptions): string;
    export function sassBuild(file: string, outFile: string, options?: SassCompilerOptions): void;
    export function sassBuildFiles(files: string | string[], output: OutputOptions, options?: SassCompilerOptions): void;
    export function sassBuildString(source: string, outFile: string, options?: SassCompilerOptions): void;
    export function wrapCompiler(options: SassCompilerOptions): SassCompiler;
    export class Logger implements LoggerType {
        time(label: string): void;
        timeEnd(label: string, level?: string, prefix?: string, message?: string): string | void;
        log(level: string, prefix: string, message: string, ...args: []) : void;
        silly(prefix: string, message: string): void;
        debug(prefix: string, message: string): void;
        verbose(prefix: string, message: string): void;
        info(prefix: string, message: string): void;
        warn(prefix: string, message: string): void;
        error(prefix: string, message: string): void;
    }
}
