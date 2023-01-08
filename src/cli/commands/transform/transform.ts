import { logger, exit, requireUserFile } from '../../../utils';
import { validateParams } from './validate-params';
import { transform } from '../../../transform';

export function cliTransform( params ) {

    try {
        validateParams( params );
    } catch (error) {
        exit( 1, 'error', 'cli > transform', error.message );
    }

    const { file, outFile, transformer } = params;
    const transformFn = <Function> requireUserFile( transformer );

    logger.silly('cli > transform', '--file parameter passed.');
    logger.silly('cli > transform', `--file: ${file.toString()}`);

    logger.silly('cli > transform', '--file is string.' );
    logger.silly('cli > transform', 'Attempting to transform...');
    transform( file, outFile, transformFn );
    logger.silly('cli > transform', 'Transform successful.');
}
