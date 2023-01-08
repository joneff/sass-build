import {
    exit,
    logger
} from "../../../utils";
import { validateParams } from "./validate-params";
import { sassBuild, sassBuildFiles, sassBuildString } from '../../../build';

type CliBuildParams = {
    file: string | string[];
    source: string;
    glob: string | string[];
    outFile: string;
    outDir: string;
}

export function cliBuild( params ) {

    try {
        validateParams( params );
    } catch ( err ) {
        exit( 1, 'error', 'cli > build', err.message );
    }

    const { file, source, glob, outFile, outDir } = <CliBuildParams> params;

    if ( file ) {
        logger.silly('cli > build', '--file parameter passed.');
        logger.silly('cli > build', `--file: ${file.toString()}`);

        if (typeof file === 'string') {
            logger.silly( 'cli > build', '--file is string.' );
            logger.silly( 'cli > build', 'Attempting to build...' );

            if ( outFile !== undefined ) {
                sassBuild( file, outFile );
            } else {
                sassBuildFiles( [ file ], <OutputOptions> { path: outDir } );
            }
            logger.silly( 'cli > build', 'Build successful.' );
        }

        if (Array.isArray(file)) {
            logger.silly( 'cli > build', '--file is array.' );
            logger.silly( 'cli > build', 'Attempting to build...' );
            sassBuildFiles( file, <OutputOptions> { path: outDir } );
            logger.silly( 'cli > build', 'Build successful.' );
        }
    }

    if ( glob ) {
        logger.silly( 'cli > build', '--glob parameter passed.' );

        if ( typeof glob === 'string' ) {
            logger.silly( 'cli > build', '--glob is string.' );
            logger.silly( 'cli > build', 'Attempting to build...' );
            sassBuildFiles( [ glob ], <OutputOptions> { path: outDir } );
            logger.silly( 'cli > build', 'Build successful.' );
        }

        if ( Array.isArray(glob) ) {
            logger.silly( 'cli > build', '--glob is array.' );
            logger.silly( 'cli > build', 'Attempting to build...' );
            sassBuildFiles( glob, <OutputOptions> { path: outDir } );
            logger.silly( 'cli > build', 'Build successful.' );
        }
    }

    if ( source ) {
        logger.silly('cli > build', '--source parameter passed.');

        logger.silly('cli > build', 'Attempting to build...');
        sassBuildString( source, outFile );
        logger.silly('cli > build', 'Build successful.');
    }
}
