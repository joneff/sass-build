import argsParser from 'yargs-parser';
import * as commands from './commands';

// eslint-disable-next-line complexity
export function validateParams( argv: argsParser.Arguments, argsParserOpts: argsParser.Options ) {

    const {
        _: _commandList,
        file, source, glob, outFile, outDir, transformer,
        config, debug, version,
        ...rest
    } = argv;

    const commandList = <string[]> _commandList || [];
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

    // Throw error for command with --version parameter
    if ( version && commandName !== undefined ) {
        throw new Error( '--version parameter cannot be passed to commands.' );
    }

    // Throw error for --version parameter with other parameters
    if (
        version
        && (
            params.length > 0
            || restParams.length > 0
            || config
            || debug
        )
    ) {
        throw new Error( '--version parameter cannot be used with other parameters.' );
    }

    // Throw error for empty command name
    if ( commandName === '' ) {
        throw new Error( 'Command name is empty.' );
    }

    // Throw error for unknown command
    if ( commandName !== undefined && typeof command !== 'function' ) {
        throw new Error( `Command not found: ${commandName}.` );
    }

    // Throw error for debug parameter for info
    if ( commandName === 'info' && debug ) {
        throw new Error( '--debug parameter cannot be passed to "info" command.' );
    }

    // Throw error for command with config parameter
    if ( commandName !== undefined && config !== undefined) {
        throw new Error( '--config parameter cannot be passed to commands.' );
    }

    // Throw error for extra parameters for config
    if ( config !== undefined && params.length > 0 ) {
        throw new Error( '--config parameter cannot be used with other parameters.' );
    }

    // Throw error for empty file
    if (file === '' || (Array.isArray( file ) && file.length === 0 ) ) {
        throw new Error( '--file must not be empty.' );
    }

    // Throw error for empty source
    if (source === '' ) {
        throw new Error( '--source must not be empty.' );
    }

    // Throw error for empty glob
    if (glob === '' || (Array.isArray( glob ) && glob.length === 0 ) ) {
        throw new Error( '--glob must not be empty.' );
    }

    // Throw error for empty outFile
    if (outFile === '' ) {
        throw new Error( '--outFile must not be empty.' );
    }

    // Throw error for empty outDir
    if (outDir === '' ) {
        throw new Error( '--outDir must not be empty.' );
    }

    // Throw error for file and source
    if ( file !== undefined && source !== undefined ) {
        throw new Error( '--file and --source parameters cannot be used together.' );
    }

    // Throw error for file and glob
    if ( file !== undefined && glob !== undefined ) {
        throw new Error( '--file and --glob parameters cannot be used together.' );
    }

    // Throw error for source and glob
    if ( source !== undefined && glob !== undefined ) {
        throw new Error( '--source and --glob parameters cannot be used together.' );
    }

    // THrow error for outFile and outDir
    if ( outFile !== undefined && outDir !== undefined ) {
        throw new Error( '--outFile and --outDir parameters cannot be used together.' );
    }

}
