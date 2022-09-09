import { wrapCompiler } from '../compiler';

export function sassBuildString( source: string, outFile: string, options?: CliBuildOptions ) : void {
    const compiler = wrapCompiler( options );

    compiler.buildString( source, outFile, options?.sassOptions );
}
