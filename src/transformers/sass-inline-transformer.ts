import path from 'path';
import glob from 'glob';
import _ from 'lodash';
import baka from '@joneff/baka';

import {
    CWD,
    padCwd,
    trimCwd,
    isString,
    logger,
    writeFile,
    replacePathVariables
} from '../utils';

export const SassInlineTransformer : CliTransformer = {
    transformFile,
    transformGlob
};

function transformFile( file: string, outFile: string, options: CliTransformOptions ) {
    const _cwd = options.cwd;

    if (path.isAbsolute(file) === false) {
        // eslint-disable-next-line no-param-reassign
        file = padCwd( _cwd, file );
    }

    if (path.isAbsolute(outFile) === false) {
        // eslint-disable-next-line no-param-reassign
        outFile = padCwd( _cwd, outFile );
    }

    logger.info(
        'transform', '%s => %s',
        trimCwd(CWD, file),
        trimCwd(CWD, outFile)
    );

    const result = baka.compile( file, <baka.CompileOptions> { cwd: _cwd } );

    writeFile( outFile, result.content );
}

function transformGlob( fileOrGlob: string | string[], output: OutputOptions, options: CliTransformOptions ) {
    const _cwd = options.cwd;

    if (isString(fileOrGlob)) {
        logger.warn( 'cli > config > transform > transformGlob', 'Prefer string[] for fileOrGlob option.');
        // eslint-disable-next-line no-param-reassign
        fileOrGlob = [ fileOrGlob ];
    }

    // eslint-disable-next-line no-param-reassign
    output = _.defaults({}, output, { path: 'dist', filename: '[name].css' });

    if (path.isAbsolute(output.path) === false) {
        output.path = padCwd( _cwd, output.path );
    }

    fileOrGlob.forEach(fileOrGlob => {
        if (path.isAbsolute(fileOrGlob) === false) {
            // eslint-disable-next-line no-param-reassign
            fileOrGlob = padCwd( _cwd, fileOrGlob );
        }

        // eslint-disable-next-line no-param-reassign
        fileOrGlob = fileOrGlob.split(path.sep).join(path.posix.sep);

        glob.sync(fileOrGlob).forEach(file => {
            const outFile = path.resolve(
                output.path,
                replacePathVariables( output.filename, file )
            );

            transformFile( file, outFile, options );
        });
    });
}
