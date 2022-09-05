import { wrapImplementation } from '../compiler';

export function sassCompileString( source: string, options?: CliOptions ) : string {
    const compiler = wrapImplementation( options );

    return compiler.compileString( source, options?.sassOptions );
}
