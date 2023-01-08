import fs from 'fs';
import path from 'path';
import glob from 'glob';
import _ from 'lodash';

import {
    CWD,
    padCwd,
    trimCwd,
    logger,
    writeFile,
    isString,
    replacePathVariables
} from '../utils';

export function transform( file: string, outFile: string, transformFn: Function) {

    if (!fs.existsSync(file)) {
        throw new Error(`File ${file} does not exist`);
    }

    if (typeof transformFn !== 'function') {
        throw new Error('transformFn must be a function');
    }

    if (path.isAbsolute(file)) {
        // eslint-disable-next-line no-param-reassign
        file = padCwd(CWD, file);
    }

    if (path.isAbsolute(outFile)) {
        // eslint-disable-next-line no-param-reassign
        outFile = padCwd(CWD, outFile);
    }

    logger.info(
        'transform', '%s => %s',
        trimCwd(CWD, file),
        trimCwd(CWD, outFile)
    );

    const result = transformFn(file);

    writeFile( outFile, result );
}


export function transformFiles( files: string[], output: OutputOptions, transformFn: Function) {

    if (isString(files)) {
        logger.warn( 'transform', 'Prefer string[] for files option.');
        // eslint-disable-next-line no-param-reassign
        files = [ files ];
    }

    // eslint-disable-next-line no-param-reassign
    output = _.defaults({}, output, { path: 'dist' });

    if (!path.isAbsolute(output.path)) {
        output.path = padCwd(CWD, output.path);
    }

    files.forEach(fileOrGlob => {
        if (path.isAbsolute(fileOrGlob)) {
            // eslint-disable-next-line no-param-reassign
            fileOrGlob = padCwd(CWD, fileOrGlob);
        }

        // eslint-disable-next-line no-param-reassign
        fileOrGlob = fileOrGlob.split(path.sep).join(path.posix.sep);

        glob.sync(fileOrGlob).forEach(file => {
            const outFile = path.resolve(
                output.path,
                replacePathVariables( output.filename, file )
            );

            transform( file, outFile, transformFn );
        });

    });

}
