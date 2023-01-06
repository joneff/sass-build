import {
    exit,
    logger
} from "../../../utils";
import { validateParams } from "./validate-params";
import { sassCompile, sassCompileString } from '../../../compile';

type CliCompileParams = {
    file: string;
    source: string;
}

export function cliCompile(params) {

    try {
        validateParams( params );
    } catch ( err ) {
        exit( 1, 'error', 'cli > compile', err.message );
    }

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
