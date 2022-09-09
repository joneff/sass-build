import { wrapCompiler } from '../compiler';

export function sassCompile( file: string, options?: CliBuildOptions ) : string {
    const compiler = wrapCompiler( options );

    return compiler.compile( file, options?.sassOptions );
}
