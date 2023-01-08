/// <reference path="../../types/index.d.ts" />

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

    const { error, version, commandName, params, config } = parseArgs( argv );

    if ( error ) {
        // process.stderr.write( `${error.message}\n` );
        exit( 1, 'error', 'cli', error.message );
    }

    if ( version ) {
        process.stdout.write( `${VERSION}\n` );
        process.exit(0);
    }

    if ( commandName ) {
        commands.get( commandName )( params );
        exitSuccess();
    }

    if ( config !== undefined ) {
        processConfigFile( config );
        exitSuccess();
    }

    process.stdout.write( 'No command passed and no default config found!\n' );
    process.exit(0);
}

export function parseArgs( argv : argsParser.Arguments ) : {
    error?: Error,
    version?: boolean,
    commandName?: string,
    params?: any,
    config?: string
} {

    try {
        validateParams( argv, ARGS_PARSER_OPTIONS );
    } catch ( error ) {
        return { error };
    }

    const {
        _: _commandList,
        file, source, glob, outFile, outDir, transformer,
        config, debug, version
    } = argv;

    const commandList = <string[]> _commandList || [];
    const commandName = <string> commandList[0];
    const command = commands.get( commandName );
    const params = { file, source, glob, outFile, outDir, transformer };

    if ( version ) {
        return { version };
    }

    if ( debug ) {
        logger.level = 'debug';
        logger.silly( 'cli', 'Starting in debug mode.' );
    }

    if ( commandName && command ) {
        logger.silly( 'cli', 'Command is: %s', commandName );

        return { commandName, params };
    }
    logger.silly( 'cli', 'No command passed.' );

    if ( config ) {
        logger.silly( 'cli', 'Config passed: %s', config );

        return { config };
    }
    logger.silly( 'cli', 'No config passed.' );

    const hasParams = Object.values(params).filter( item => item !== undefined).length > 0;
    const hasConfig = fs.existsSync( 'sass.config.js' );

    if ( hasParams ) {
        logger.silly( 'cli', 'Attempting build command with cli parameters' );

        return { commandName: 'build', params };
    }

    if ( hasConfig ) {
        logger.silly( 'cli', 'Attempting to process default config' );

        return { config: null };
    }

    return {};
}

function exitSuccess() {
    exit(0, 'silly', 'cli', `Finished after ${logger.timeEnd('cli:start')}`);
}
