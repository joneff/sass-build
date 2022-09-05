import { wrapImplementation } from '../compiler';

export function sassBuildFiles( file: string | string[], output: OutputOptions = <OutputOptions>{}, options?: CliOptions ) : void {
    const compiler = wrapImplementation( options );

    compiler.buildFiles( file, output, options?.sassOptions );
}
