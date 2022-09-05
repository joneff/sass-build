import { wrapImplementation } from '../compiler';

export function sassBuildString( source: string, outFile: string, options?: CliOptions ) : void {
    const compiler = wrapImplementation( options );

    compiler.buildString( source, outFile, options?.sassOptions );
}
