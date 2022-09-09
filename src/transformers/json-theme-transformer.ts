import fs from 'fs';
import path from 'path';
import glob from 'glob';
import _ from 'lodash';

import {
    CWD,
    padCwd,
    trimCwd,
    isString,
    logger,
    writeFile,
    replacePathVariables
} from '../utils';

export const JsonThemeTransformer : CliTransformer = {
    transformFile,
    transformGlob
};

function __jsonTransformer(jsonFile) {
    const json = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    const sassContent = [];
    let groups;

    if (Array.isArray(json)) {
        groups = json;
    } else {
        groups = json.groups || [];
    }

    groups.forEach( (group) => {

        // group is { name: value }
        if (typeof group.value === 'string') {
            let name = <string> group.name;
            if (name[0] !== '$') {
                name = `$${name}`;
            }
            sassContent.push(`${name}: ${group.value};`);

            return;
        }

        // group is { variables: [] }
        for ( const varEntry of Object.entries(group.variables) ) {
            let name = <string> varEntry[0].trim();
            let value = <string | {value: string}> varEntry[1];

            if (typeof value !== 'string') {
                value = value.value;
            }

            if (name[0] !== '$') {
                name = `$${name}`;
            }
            sassContent.push(`${name}: ${value};`);
        }
    });

    return sassContent.join('\n');
}

function transformFile( file: string, outFile: string, options: CliTransformOptions ) {
    const _cwd = options.cwd;
    const transformerOptions = options.transformerOptions;
    let header = transformerOptions.header || '';
    let footer = transformerOptions.footer || '';

    if (path.isAbsolute(file) === false) {
        // eslint-disable-next-line no-param-reassign
        file = padCwd( _cwd, file );
    }

    if (path.isAbsolute(outFile) === false) {
        // eslint-disable-next-line no-param-reassign
        outFile = padCwd( _cwd, outFile );
    }

    const json = JSON.parse(fs.readFileSync(file, 'utf-8'));

    if (!Array.isArray(json)) {
        if (json.private === true) {
            logger.info('transform', 'Skipping %s', trimCwd(CWD, file));
            return;
        }

        if (typeof header === 'function') {
            header = header(file, json);
        }

        if (typeof footer === 'function') {
            footer = footer(file, json);
        }
    }

    logger.info(
        'transform', '%s => %s',
        trimCwd(CWD, file),
        trimCwd(CWD, outFile)
    );

    const result = `${header}${__jsonTransformer( file )}${footer}`;

    writeFile( outFile, result );
}

function transformGlob( fileOrGlob: string | string[], output: OutputOptions, options: CliTransformOptions ) {
    const _cwd = options.cwd;

    if (isString(fileOrGlob)) {
        logger.warn( 'config > transform > transformGlob', 'Prefer string[] for fileOrGlob option.');
        // eslint-disable-next-line no-param-reassign
        fileOrGlob = [ fileOrGlob ];
    }

    // eslint-disable-next-line no-param-reassign
    output = _.defaults({}, output, { path: 'dist', filename: '[name].scss' });

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
