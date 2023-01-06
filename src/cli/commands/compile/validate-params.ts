import { logger } from "../../../utils";


// eslint-disable-next-line complexity
export function validateParams( params ) {
    logger.silly('cli > compile', 'Validating params...');

    const { file, source, glob, outFile, outDir } = params;

    if (file && source) {
        throw new Error('Supply either --file or --source, but not both.');
    }
    if ((!file && !source)) {
        throw new Error('Supply either --file or --source.');
    }

    if (glob || outFile || outDir) {
        throw new Error('Do not supply --glob, --outFile or --outDir.');
    }

    if (file && typeof file !== 'string') {
        throw new Error('--file must be string.');
    }
    if (source && typeof source !== 'string') {
        throw new Error('--source must be string.');
    }

    logger.silly('cli > compile', 'Params validated.');
}
