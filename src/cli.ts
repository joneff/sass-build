import argsParser from 'yargs-parser';

import {
    exit,
    logger
} from './utils';
import { sassBuild, sassBuildFiles, sassBuildString } from './build';
import { sassCompile } from './compile';
import { migrateCompilerConfig } from './config-migrate';
import { buildConfig } from './config-build';

const commandMap = {
    // eslint-disable-next-line camelcase
    build: cli_build,
    // eslint-disable-next-line camelcase
    bundle: cli_bundle,
    // eslint-disable-next-line camelcase
    compile: cli_compile,
    // eslint-disable-next-line camelcase
    migrate: cli_migrate,
    // eslint-disable-next-line camelcase
    transform: cli_transform
};

const SASS_CONFIG = 'sass.config.js';
const COMPILER_CONFIG = 'compilerconfig.js';

export function cli() {
    logger.time('cli:start');

    const argv = argsParser(process.argv.slice(2), {
        alias: {
            'f': 'file',
            's': 'source',
            'g': 'glob',
            'd': 'out-file',
            'o': 'out-dir',
            't': 'transformer',
            'c': 'config'
        },
        string: [ 'file', 'source', 'glob', 'out-file', 'out-dir', 'transformer', 'config' ],
        boolean: [ 'debug' ]
    });

    if (argv.debug) {
        logger.level = 'debug';
        logger.silly('cli', 'Starting in debug mode.');
        logger.silly('cli', 'Arguments parsed.');
    }

    if (argv.version) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const version = require('../package.json').version;
        process.stdout.write(`${version}\n`);
        process.exit(0);
    }

    _validateParams(argv);

    const command = argv._[0];
    const config = argv['config'];

    if (typeof command === 'string') {
        cli_command( command, argv );
        exit_cli_success();
    } else {
        logger.silly('cli', 'No command passed.');
    }

    cli_buildConfig( config );
    exit_cli_success();
}


// eslint-disable-next-line camelcase, complexity
function _validateParams(argv: argsParser.Arguments) {
    logger.silly('cli', 'Validating params.');

    const command = argv._[0];
    const { file, source, glob, outFile, outDir, config } = argv;


    if (command) {
        if (config) {
            exit_cli_error(7, 'Pass either command or config, but not both.');
        }
        if (command === 'compile' && (glob || outFile || outDir)) {
            exit_cli_error(7, 'compile command does not need glob, outFile or outDir.');
        }
        if (command === 'migrate' && (source || glob || outDir)) {
            exit_cli_error(7, 'migrate command does not need source, glob or outDir.');
        }
        if (command === 'build' && (file && !Array.isArray(file) && !outFile)) {
            exit_cli_error(22, 'Supply outFile.');
        }
        if (file && source) {
            exit_cli_error(7, 'Supply either file or source, but not both.');
        }
        if (file && glob) {
            exit_cli_error(7, 'Supply either file or glob, but not both.');
        }
        if (source && glob) {
            exit_cli_error(7, 'Supply either source or glob, but not both.');
        }
        if (outFile && outDir) {
            exit_cli_error(7, 'Supply either outFile or outDir, but not both.');
        }
        if ((!file && !source && !glob)) {
            exit_cli_error(22, 'Supply either file, source or glob.');
        }
    }

    logger.silly('cli', '  Params valid.');
}


// eslint-disable-next-line camelcase
function cli_command(commandName: string, argv: argsParser.Arguments) {

    logger.silly('cli', `Command passed.`);
    logger.silly('cli', `  Command is: ${commandName}.`);

    const command = commandMap[commandName];

    if (typeof command === 'function') {
        logger.silly('cli', '  Command found.');
        command(argv);
        return;
    }

    exit_cli_error(22, `Invalid command: ${commandName}.`);
}


// eslint-disable-next-line camelcase
function cli_build(params) {
    const { file, source, glob, outFile, outDir } = params;

    if (file) {
        logger.silly('cli', 'File passed.');

        if (typeof file === 'string') {
            logger.silly('cli', '  File is string.');
            logger.silly('cli', '  Attempting to build...');
            sassBuild( file, outFile );
            return;
        }

        if (Array.isArray(file)) {
            logger.silly('cli', '  File is array.');
            logger.silly('cli', '  Attempting to build...');
            sassBuildFiles( <string[]> file, <OutputOptions> { path: outDir } );
            return;
        }

        exit_cli_error(22, 'file must be either string or array.');
    }

    if (glob) {
        logger.silly('cli', 'Glob passed.');

        if (typeof glob === 'string') {
            logger.silly('cli', '  Glob is string.');
            logger.silly('cli', '  Attempting to build...');
            sassBuildFiles( [ glob ], <OutputOptions> { path: outDir } );
            return;
        }

        if (Array.isArray(glob)) {
            logger.silly('cli', '  Glob is array.');
            logger.silly('cli', '  Attempting to build...');
            sassBuildFiles( <string[]> glob, <OutputOptions> { path: outDir } );
            return;
        }

        exit_cli_error(22, 'glob must be either string or array.');
    }

    if (source) {
        logger.silly('cli', 'Source passed.');

        if (typeof source === 'string') {
            logger.silly('cli', '  Source is string.');
            logger.silly('cli', '  Attempting to build...');
            sassBuildString( source, outFile );
            return;
        }

        exit_cli_error(22, 'source must be string.');
    }
}


// eslint-disable-next-line camelcase, @typescript-eslint/no-unused-vars
function cli_bundle(params) {
    exit_cli_error(38, 'Bundle not implemented');
}


// eslint-disable-next-line camelcase
function cli_compile(params) {
    const { file, source } = params;

    if (file) {
        logger.silly('cli', 'File passed.');

        if (typeof file === 'string') {
            logger.silly('cli', '  File is string.');
            logger.silly('cli', '  Attempting to compile...');
            sassCompile( file );
            return;
        }

        exit_cli_error(22, 'file must be string.');
    }

    if (source) {
        logger.silly('cli', 'Source passed.');

        if (typeof source === 'string') {
            logger.silly('cli', '  Source is string.');
            logger.silly('cli', '  Attempting to compile...');
            sassCompile( source );
            return;
        }

        exit_cli_error(22, 'source must be string.');
    }
}


// eslint-disable-next-line camelcase
function cli_migrate(params) {
    const { file, outFile } = params;

    const src = file || COMPILER_CONFIG;
    const dest = outFile || SASS_CONFIG;

    migrateCompilerConfig( src, dest );
}


// eslint-disable-next-line camelcase, @typescript-eslint/no-unused-vars
function cli_transform(params) {
    exit_cli_error(38, 'Transform not implemented');
}


// eslint-disable-next-line camelcase
function cli_buildConfig( config?: string ) {

    if (config === undefined || config === '') {
        logger.silly('cli', 'No valid config passed.');
        logger.silly('cli', '  Using sass.config.js');
        // eslint-disable-next-line no-param-reassign
        config = SASS_CONFIG;
    } else {
        logger.silly('cli', 'Config passed.');
        logger.silly('cli', `  Config is: ${config}.`);
    }

    buildConfig( config );
}


// eslint-disable-next-line camelcase
function exit_cli_success() {
    exit(0, 'silly', 'cli', `Finished after ${logger.timeEnd('cli:start')}`);
}
// eslint-disable-next-line camelcase
function exit_cli_error( errCode: number, message: string ) {
    exit(errCode, 'error', 'cli', message);
}
