import { wrapImplementation } from '../compiler';

export function sassBuild( file: string, outFile: string, options?: CliOptions ) : void {
    const compiler = wrapImplementation( options );

    compiler.build( file, outFile, options?.sassOptions );
}
