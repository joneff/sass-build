import { wrapImplementation } from './sass-compiler';

function sassBuild( file: string, outFile: string, options?: CliOptions ) : void {
    const compiler = wrapImplementation( options );

    compiler.build( file, outFile, options?.sassOptions );
}
function sassBuildFiles( files: string | string[], output?: OutputOptions, options?: CliOptions ) : void {
    const compiler = wrapImplementation( options );

    compiler.buildFiles( files, output, options?.sassOptions );
}

function sassBuildString( source: string, outFile: string, options?: CliOptions ) : void {
    const compiler = wrapImplementation( options );

    compiler.buildString( source, outFile, options?.sassOptions );
}

export {
    sassBuild,
    sassBuildFiles,
    sassBuildString
};
