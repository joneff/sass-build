import { wrapCompiler } from '../compiler';

export function sassBuild( file: string, outFile: string, options?: SassCompilerOptions ) : void {
    const compiler = wrapCompiler( options );

    compiler.build( file, outFile, options?.sassOptions );
}
