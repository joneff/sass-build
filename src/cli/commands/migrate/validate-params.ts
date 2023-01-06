import { logger } from "../../../utils";


// eslint-disable-next-line complexity
export function validateParams(params) {
    logger.silly('cli > migrate', 'Validating params...');

    const { file, source, glob, outFile, outDir, transformer } = params;

    if (!file) {
        throw new Error('Supply --file parameter.');
    }

    if (source || glob || outFile || outDir) {
        throw new Error('Do not supply --source, --glob, --outFile or --outDir parameters.');
    }

    if (file && typeof file !== 'string') {
        throw new Error('--file must be string.');
    }

    if (outFile && typeof outFile !== 'string') {
        throw new Error('--outFile must be string.');
    }

    if (transformer && typeof transformer !== 'string') {
        throw new Error('--transformer must be string.');
    }

    logger.silly('cli > migrate', 'Params validated.');
}
