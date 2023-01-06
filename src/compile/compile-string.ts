import { wrapCompiler } from '../compiler';

export function sassCompileString( source: string, options?: SassCompilerOptions ) : string {
    const compiler = wrapCompiler( options );

    return compiler.compileString( source, options?.sassOptions );
}
