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

    const { command, params, config } = parseArgs( argv );

    if ( typeof command === 'function' ) {
        command( params );
        exitSuccess();
    }

    if ( config !== undefined ) {
        processConfigFile( config );
        exitSuccess();
    }

    process.stdout.write( 'No command passed and no default config found!\n' );
    process.exit(0);
}

function parseArgs( argv : argsParser.Arguments ) : { command?: Function, params?: any, config?: string } {

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
    }

    if ( commandName ) {
        logger.silly( 'cli', 'Command is: %s', commandName );

        return { command, params };
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

        return { command: commands.get( 'build' ), params };
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
