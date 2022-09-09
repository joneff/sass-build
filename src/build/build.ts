import { wrapCompiler } from '../compiler';

export function sassBuild( file: string, outFile: string, options?: CliBuildOptions ) : void {
    const compiler = wrapCompiler( options );

    compiler.build( file, outFile, options?.sassOptions );
}
