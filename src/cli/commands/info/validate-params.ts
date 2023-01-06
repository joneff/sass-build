// eslint-disable-next-line complexity
export function validateParams( params ) {
    const { file, source, glob, outFile, outDir } = params;

    if ( file !== undefined
        || source !== undefined
        || glob !== undefined
        || outFile !== undefined
        || outDir !== undefined
    ) {
        throw new Error( 'Command "info" does not accept additional parameters.' );
    }

}
