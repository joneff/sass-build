import argsParser from 'yargs-parser';
import * as commands from './commands';

// eslint-disable-next-line complexity
export function validateParams( argv: argsParser.Arguments, argsParserOpts: argsParser.Options ) {

    const {
        _: commandList,
        file, source, glob, outFile, outDir, transformer,
        config, debug, version,
        ...rest
    } = argv;
    const commandName = <string> commandList[0];
    const command = commands.get(commandName);
    const params = [ file, source, glob, outFile, outDir, transformer ].filter( item => item !== undefined );
    const commandAliases = Object.keys(argsParserOpts.alias).concat( ...Object.values(argsParserOpts.alias) );
    const restParams = Object.keys(rest).filter( item => commandAliases.includes(item) === false );

    // Throw error if more than one command is passed
    if ( commandList.length > 1 ) {
        throw new Error( 'More than one command passed.' );
    }

    // Throw error if unknown parameters are passed
    if ( Object.keys(restParams).length > 0 ) {
        throw new Error( 'Unknown parameters passed.' );
    }

    // Throw error for extra parameters for version command
    if ( version
        && (
            commandName
            || restParams.length > 0
            || config
            || debug
        )
    ) {
        throw new Error( 'Version parameter cannot be passed with other parameters.' );
    }

    // Throw error for empty command name
    if ( commandName === '' ) {
        throw new Error( 'Command name is empty.' );
    }

    // Throw error for unknown command
    if ( commandName !== undefined && typeof command !== 'function' ) {
        throw new Error( `Command not found: ${commandName}` );
    }

    // Throw error for command and config passed together
    if ( commandName !== undefined && config !== undefined) {
        throw new Error( `Command ${commandName} and config param cannot be passed together.` );
    }

    // Throw error for debug parameter for info
    if ( commandName === 'info' && debug ) {
        throw new Error( 'Debug parameter cannot be passed with info command.' );
    }

    // Throw error for extra parameters for config
    if ( config !== undefined && params.length > 0 ) {
        throw new Error( 'Config parameter cannot be passed with other parameters.' );
    }

    if ( file !== undefined && source !== undefined ) {
        throw new Error( 'File and source parameters cannot be passed together.' );
    }

    if ( file !== undefined && glob !== undefined ) {
        throw new Error( 'File and glob parameters cannot be passed together.' );
    }

    if ( source !== undefined && glob !== undefined ) {
        throw new Error( 'Source and glob parameters cannot be passed together.' );
    }

    if ( outFile !== undefined && outDir !== undefined ) {
        throw new Error( 'Out file and out dir parameters cannot be passed together.' );
    }
}
