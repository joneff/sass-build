// eslint-disable-next-line complexity
export function validateParams( params ) {
    const { file, source, glob, outFile, outDir } = params;

    if ( file || source || glob || outFile || outDir ) {
        throw new Error( 'Command "info" does not accept additional parameters.' );
    }

}
