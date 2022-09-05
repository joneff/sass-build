import { wrapImplementation } from '../compiler';

export function sassCompile( file: string, options?: CliOptions ) : string {
    const compiler = wrapImplementation( options );

    return compiler.compile( file, options?.sassOptions );
}
