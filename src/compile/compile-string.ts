import { wrapCompiler } from '../compiler';

export function sassCompileString( source: string, options?: CliBuildOptions ) : string {
    const compiler = wrapCompiler( options );

    return compiler.compileString( source, options?.sassOptions );
}
