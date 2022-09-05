import {
    exit,
    logger
} from "../../utils";
import { sassCompile, sassCompileString } from '../../compile';

type CliCompileParams = {
    file: string;
    source: string;
}

export function cliCompile(params) {
    validateParams( params );

    const { file, source } = <CliCompileParams> params;
    let css = '';

    if (file) {
        logger.silly('cli > compile', 'File passed.');

        logger.silly('cli > compile', '  Attempting to compile...');
        css = sassCompile( file );
        logger.silly('cli > compile', '  Compile successful.');
    }

    if (source) {
        logger.silly('cli > compile', 'Source passed.');

        logger.silly('cli > compile', '  Attempting to compile...');
        css = sassCompileString( source );
        logger.silly('cli > compile', '  Compile successful.');
    }

    process.stdout.write( css );
}


// eslint-disable-next-line complexity
function validateParams(params) {
    logger.silly('cli > compile', 'Validating params...');

    const { file, source, glob, outFile, outDir } = params;

    if (file && source) {
        exitError(7, 'Supply either --file or --source, but not both.');
    }
    if ((!file && !source)) {
        exitError(22, 'Supply either --file or --source.');
    }

    if (glob || outFile || outDir) {
        exitError(7, 'Do not supply --glob, --outFile or --outDir.');
    }

    if (file && typeof file !== 'string') {
        exitError(22, '--file must be string.');
    }
    if (source && typeof source !== 'string') {
        exitError(22, '--source must be string.');
    }

    logger.silly('cli > compile', 'Params validated.');
}

function exitError( errCode: number, message: string ) {
    exit(errCode, 'error', 'cli > compile', message);
}
