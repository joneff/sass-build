import fs from 'fs';
import path from 'path';
import argsParser from 'yargs-parser';

import * as commands from './commands';
import { validateParams } from './validate-params';
import { processConfigFile } from '../config';
import {
    exit,
    logger
} from '../utils';

const VERSION = JSON.parse( fs.readFileSync( path.resolve( __dirname, '../../package.json' ), 'utf8' ) ).version;
const ARGS_PARSER_OPTIONS : argsParser.Options = {
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
};

export function cli() {
    logger.time( 'cli:start' );

    const argv = argsParser( process.argv.slice(2), ARGS_PARSER_OPTIONS );

    try {
        validateParams( argv, ARGS_PARSER_OPTIONS );
    } catch ( err ) {
        exit( 1, 'error', 'cli', err.message );
    }

    const {
        _: commandList,
        file, source, glob, outFile, outDir, transformer,
        config, debug, version
    } = argv;
    const commandName = <string> commandList[0];
    const command = commands.get( commandName );
    const params = { file, source, glob, outFile, outDir, transformer };

    if ( version ) {
        process.stdout.write( `${VERSION}\n` );
        process.exit(0);
    }

    if ( debug ) {
        logger.level = 'debug';
        logger.silly( 'cli', 'Starting in debug mode.' );
        logger.silly( 'cli', 'Arguments parsed.' );
    }

    if ( commandName ) {
        logger.silly( 'cli', 'Command passed' );
        logger.silly( 'cli', 'Command is: %s', commandName );

        command( params );
        exitSuccess();
    }
    logger.silly( 'cli', 'No command passed.' );

    if ( config ) {
        logger.silly( 'cli', 'Config passed' );

        processConfigFile( config );
        exitSuccess();
    }

    logger.silly( 'cli', 'No config passed.' );

    if ( Object.keys(params).length > 0 ) {
        logger.silly( 'cli', 'Parameters passed.' );
        logger.silly( 'cli', 'Falling back to build command' );

        commands.get( 'build' )( params );
        exitSuccess();
    }

    processConfigFile( null );
    exitSuccess();
}

function exitSuccess() {
    exit(0, 'silly', 'cli', `Finished after ${logger.timeEnd('cli:start')}`);
}
