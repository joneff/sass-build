import {
    exit,
    logger
} from "../../../utils";
import { sassBuild, sassBuildFiles, sassBuildString } from '../../../build';

type CliBuildParams = {
    file: string | string[];
    source: string;
    glob: string | string[];
    outFile: string;
    outDir: string;
}

export function cliBuild( params ) {

    validateParams(params);

    const { file, source, glob, outFile, outDir } = <CliBuildParams> params;

    if (file) {
        logger.silly('cli > build', '--file parameter passed.');
        logger.silly('cli > build', `--file: ${file.toString()}`);

        if (typeof file === 'string') {
            logger.silly('cli > build', '--file is string.');
            logger.silly('cli > build', 'Attempting to build...');
            sassBuild( file, outFile );
            logger.silly('cli > build', 'Build successful.');
        }

        if (Array.isArray(file)) {
            logger.silly('cli > build', '--file is array.');
            logger.silly('cli > build', 'Attempting to build...');
            sassBuildFiles( file, <OutputOptions> { path: outDir } );
            logger.silly('cli > build', 'Build successful.');
        }
    }

    if (glob) {
        logger.silly('cli > build', '--glob parameter passed.');

        if (typeof glob === 'string') {
            logger.silly('cli > build', '--glob is string.');
            logger.silly('cli > build', 'Attempting to build...');
            sassBuildFiles( [ glob ], <OutputOptions> { path: outDir } );
            logger.silly('cli > build', 'Build successful.');
        }

        if (Array.isArray(glob)) {
            logger.silly('cli > build', '--glob is array.');
            logger.silly('cli > build', 'Attempting to build...');
            sassBuildFiles( glob, <OutputOptions> { path: outDir } );
            logger.silly('cli > build', 'Build successful.');
        }
    }

    if (source) {
        logger.silly('cli > build', '--source parameter passed.');

        logger.silly('cli > build', 'Attempting to build...');
        sassBuildString( source, outFile );
        logger.silly('cli > build', 'Build successful.');
    }
}


// eslint-disable-next-line complexity
function validateParams(params) {
    logger.silly('cli > build', 'Validating params...');

    const { file, source, glob, outFile, outDir } = params;

    if (file && source) {
        exitError(7, 'Supply either --file or --source, but not both.');
    }
    if (file && glob) {
        exitError(7, 'Supply either --file or --glob, but not both.');
    }
    if (source && glob) {
        exitError(7, 'Supply either --source or --glob, but not both.');
    }
    if ((!file && !source && !glob)) {
        exitError(22, 'Supply either --file, --source or --glob.');
    }

    if (outFile && outDir) {
        exitError(7, 'Supply either --outFile or --outDir, but not both.');
    }

    if (file) {
        if (typeof file !== 'string' && !Array.isArray(file)) {
            exitError(22, '--file must be either string or array.');
        }
        if (Array.isArray(file) && outFile) {
            exitError(22, 'Supply --outDir instead of outFile.');
        }
    }
    if (glob) {
        if (typeof glob !== 'string' && !Array.isArray(glob)) {
            exitError(22, '--glob must be either string or array.');
        }
        if (Array.isArray(file) && outFile) {
            exitError(22, 'Supply --outDir instead of --outFile.');
        }
    }
    if (source && typeof source !== 'string') {
        exitError(22, '--source must be string.');
    }

    if (outFile && typeof outFile !== 'string') {
        exitError(22, '--outFile must be string.');
    }
    if (outDir && typeof outDir !== 'string') {
        exitError(22, '--outDir must be string.');
    }

    logger.silly('cli > build', 'Params validated.');
}

function exitError( errCode: number, message: string ) {
    exit(errCode, 'error', 'cli > build', message);
}
