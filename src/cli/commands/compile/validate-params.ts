import { logger } from "../../../utils";


// eslint-disable-next-line complexity
export function validateParams( params ) {
    logger.silly('cli > compile', 'Validating params...');

    const { file, source, outFile, outDir } = params;

    if ( file === undefined && source === undefined ) {
        throw new Error('Supply either --file or --source.');
    }

    if ( file && typeof file !== 'string' ) {
        throw new Error('--file must be string.');
    }

    if ( source && typeof source !== 'string' ) {
        throw new Error('--source must be string.');
    }

    if ( outFile !== undefined || outDir !== undefined ) {
        throw new Error('Do not supply --outFile or --outDir.');
    }

    logger.silly('cli > compile', 'Params validated.');
}
