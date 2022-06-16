import argsParser from 'yargs-parser';

import {
    exit,
    logger,
    fileExists,
} from './utils';
import { sassBuild, sassBuildFiles } from './sass-build';
import { sassCompile } from './sass-compile';
import { migrateCompilerConfig } from './config-migrate';
import { buildConfig } from './config-build';

export function cli() {
    logger.time('cli:start');

    const argv = argsParser(process.argv.slice(2), {
        alias: {
            'f': 'file',
            'd': 'out-file',
            'c': 'config',
            'g': 'glob',
            'o': 'output-path',
            'v': 'version'
        }
    });

    const { config, glob, outputPath } = argv;
    const file = <string> (argv._['file'] || argv['file']);
    const outFile = <string> (argv._['outFile'] || argv['outFile']);

    if (argv.version) {
        cli_version();
    }

    if (argv.migrateCompilerConfig) {
        cli_migrateCompilerConfig(config, outFile);
    }

    if (typeof file === 'string' ) {
        cli_buildFile( <string> file, <string> outFile );
    }

    if (typeof glob === 'string') {
        cli_buildFiles( glob, outputPath );
    }

    if (config === undefined || typeof config === 'string') {
        cli_buildConfig( config );
    }

    exit(0, 'silly', `Finished after ${logger.timeEnd('cli:start')}`);
}


// eslint-disable-next-line camelcase
function cli_version() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const version = require('../package.json').version;
    exit( 0, 'info', 'cli', version );
}


// eslint-disable-next-line camelcase
function cli_migrateCompilerConfig( config, outFile ) {

    const compilerConfigPath = config || 'compilerconfig.json';
    const sassConfigPath = outFile || 'sass.config.js';

    if (fileExists(compilerConfigPath) === false) {
        exit( 9, 'error', 'cli', `Cannot find file ${compilerConfigPath}.`);
    }

    logger.silly('cli', 'Found %s. Migrating...', compilerConfigPath);

    migrateCompilerConfig( compilerConfigPath, sassConfigPath );

    logger.info('cli', 'Successfully migrated %s to %s', compilerConfigPath, sassConfigPath );

    exit(0, 'silly', 'cli', `Finished after ${logger.timeEnd('cli:start')}`);
}


// eslint-disable-next-line camelcase
function cli_buildFile( file: string, outFile?: string ) {
    if ( fileExists(file) === false ) {
        exit( 9, 'error', 'cli', 'Input file must be a valid file.');
    }

    if (typeof outFile === 'string') {
        sassBuild( file, outFile );
        exit(0, 'silly', 'cli', `Finished after ${logger.timeEnd('cli:start')}`);
    }

    process.stdout.write( sassCompile(file) );
    exit(0, 'silly', 'cli', `Finished after ${logger.timeEnd('cli:start')}`);
}


// eslint-disable-next-line camelcase
function cli_buildFiles( glob: string, outputPath?: string ) {
    const opts : Partial<OutputOptions> = {
        path: outputPath
    };
    sassBuildFiles( [ glob ], <OutputOptions> opts );
    exit(0, 'silly', 'cli', `Finished after ${logger.timeEnd('cli:start')}`);
}


// eslint-disable-next-line camelcase
function cli_buildConfig( config: string ) {
    const configFile = config || 'sass.config.js';

    if (fileExists(configFile) === false ) {
        exit( 9, 'error', 'cli', 'Config file must be a valid file.' );
    }

    buildConfig( configFile );
    exit(0, 'silly', 'cli', `Finished after ${logger.timeEnd('cli:start')}`);
}
