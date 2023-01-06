import { wrapCompiler } from '../compiler';

export function sassCompile( file: string, options?: SassCompilerOptions ) : string {
    const compiler = wrapCompiler( options );

    return compiler.compile( file, options?.sassOptions );
}
