import {
    exit,
    logger,
    requireUserFile,
    fileExists,
    writeFile
} from '../utils';
import { compilerConfigTransformer } from './complier-config-transformer';


export function migrate(src: string, dest: string, transformer: string | Function = compilerConfigTransformer) {

    if (!fileExists(src)) {
        exit(2, 'error', 'migrate', `Cannot find file ${src}`);
    }

    if (typeof transformer === 'string') {
        if (!fileExists(transformer)) {
            exit(2, 'error', 'migrate', `Cannot find file ${src}`);
        }
        // eslint-disable-next-line no-param-reassign
        transformer = <Function> requireUserFile(transformer);
    }

    if (typeof transformer !== 'function') {
        exit(22, 'error', 'migrate', `Transformer is not a function.`);
    }

    logger.silly('migrate', 'Found %s.', src);
    logger.silly('migrate', '  Migrating...');

    const sassConfigContent = transformer( src );

    writeFile( dest, sassConfigContent );

    logger.info('migrate', 'Successfully migrated %s to %s', src, dest );
}
