import argsParser from 'yargs-parser';

import * as commands from './commands';
import { processConfigFile } from '../config';
import {
    exit,
    logger
} from '../utils';

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

    const commandName = argv._[0];
    const config = argv['config'];

    if (typeof commandName === 'string') {
        logger.silly('cli', 'Command passed');

        const command = getCommand(commandName);
        logger.silly('cli', 'Command is: %s', commandName);

        if (typeof command === 'function') {
            logger.silly('cli', 'Command found.');
            command(argv);
            exitSuccess();
        } else {
            exit(127, 'error', `Command not found: ${commandName}`);
        }
    } else {
        logger.silly('cli', 'No command passed.');
    }

    if (!config) {
        logger.silly('cli', 'No config passed.');
    }

    processConfigFile( config );
    exitSuccess();
}

function getCommand(name) {
    const commandName = 'cli' + name[0].toUpperCase() + name.slice(1);
    return commands[commandName];
}

function exitSuccess() {
    exit(0, 'silly', 'cli', `Finished after ${logger.timeEnd('cli:start')}`);
}
