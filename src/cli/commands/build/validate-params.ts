import { logger } from "../../../utils";

// eslint-disable-next-line complexity
export function validateParams( params ) {
    logger.silly( 'cli > build', 'Validating params...' );

    const { file, source, glob, outFile, outDir } = params;

    if ( file === undefined && source === undefined && glob === undefined ) {
        throw new Error( 'Supply either --file, --source or --glob.' );
    }

    if ( file !== undefined ) {
        if (typeof file !== 'string' && !Array.isArray(file)) {
            throw new Error( '--file must be either string or array.' );
        }
        if (file === '' || (Array.isArray( file ) && file.length === 0 ) ) {
            throw new Error( '--file must not be empty.' );
        }
        if (Array.isArray(file) && outFile) {
            throw new Error( 'Supply --outDir instead of --outFile.' );
        }
    }

    if ( glob !== undefined ) {
        if (typeof glob !== 'string' && !Array.isArray(glob)) {
            throw new Error( '--glob must be either string or array.' );
        }
        if (glob === '' || (Array.isArray( glob ) && glob.length === 0 ) ) {
            throw new Error( '--glob must not be empty.' );
        }
        if (Array.isArray(glob) && outFile) {
            throw new Error( 'Supply --outDir instead of --outFile.' );
        }
    }

    if ( source !== undefined && typeof source !== 'string' ) {
        throw new Error( '--source must be string.' );
    }

    if ( outFile !== undefined && typeof outFile !== 'string' ) {
        throw new Error( '--outFile must be string.' );
    }

    if ( outDir !== undefined && typeof outDir !== 'string' ) {
        throw new Error( '--outDir must be string.' );
    }

    logger.silly( 'cli > build', 'Params validated.' );
}
