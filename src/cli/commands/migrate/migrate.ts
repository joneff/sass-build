import {
    exit,
    logger
} from "../../../utils";
import { migrate } from '../../../migrate';

type CliMigrateParams = {
    file: string;
    outFile: string;
    transformer: string;
}

export function cliMigrate(params) {
    validateParams(params);

    const { file, outFile, transformer } = <CliMigrateParams> params;

    migrate( file, outFile, transformer );
}


// eslint-disable-next-line complexity
function validateParams(params) {
    logger.silly('cli > migrate', 'Validating params...');

    const { file, source, glob, outFile, outDir, transformer } = params;

    if (!file) {
        exitError(22, 'Supply --file parameter.');
    }

    if (source || glob || outFile || outDir) {
        exitError(7, 'Do not supply --source, --glob, --outFile or --outDir parameters.');
    }

    if (file && typeof file !== 'string') {
        exitError(22, '--file must be string.');
    }
    if (outFile && typeof outFile !== 'string') {
        exitError(22, '--outFile must be string.');
    }
    if (transformer && typeof transformer !== 'string') {
        exitError(22, '--transformer must be string.');
    }

    logger.silly('cli > migrate', 'Params validated.');
}

function exitError( errCode: number, message: string ) {
    exit(errCode, 'error', 'cli > migrate', message);
}
