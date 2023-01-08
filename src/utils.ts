import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mime from 'mime-types';
import _ from 'lodash';

import { Logger } from './logger';

const toString = Object.prototype.toString;
const REGEX_REPLACER_TEMPLATE = /\[([\w]+)(?::([\w:\\.-]+))?\]/gi;


// #region npm-ish
export function requireUserFile(file : string) : any {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(path.resolve(CWD, file));
}
// #endregion

// #region misc
// eslint-disable-next-line max-params
export function exit( code: number, level?: string, prefix?: string, message?: string, ...args: [] ) {

    if (level !== undefined) {
        logger[level](prefix, message, ...args);
    }

    process.exit(code);
}
// #endregion


// #region lang
export function isString( value ) : value is string {
    return typeof value === 'string';
}
export function isArray( value ) : value is any[] {
    return Array.isArray( value );
}

export function objectType(obj: any) : string {

    if ( obj === undefined ) {
        return 'undefined';
    }

    if ( obj === null ) {
        return 'null';
    }

    if ( Number.isNaN( obj ) ) {
        return 'NaN';
    }

    return obj.__proto__.constructor.name.toLowerCase();
}

export function objectTag(obj: any) : string {

    if ( obj === undefined ) {
        return '[object Undefined]';
    }

    if ( obj === null ) {
        return '[object Null]';
    }

    if ( Number.isNaN( obj ) ) {
        return '[object NaN]';
    }

    return toString.call( obj );
}
// #endregion


// #region fs
export function fileExists( file: string ) : boolean {
    return fs.existsSync( file );
}
export function writeFile( file: string, content: string ) : void {
    fs.mkdirSync( path.dirname( file ), { recursive: true } );
    fs.writeFileSync( file, content, 'utf-8' );
}
// #endregion


// #region logger
export const logger = new Logger();
// #endregion


// #region cwd
export const CWD = process.cwd();
export function trimCwd(cwd: string, filePath: string) : string {
    if ( path.isAbsolute(filePath) && !filePath.startsWith(cwd) ) {
        return filePath;
    }

    return path.relative(cwd, filePath);
}
export function padCwd(cwd: string, filePath: string) : string {
    if ( path.isAbsolute(filePath) && !filePath.startsWith(cwd) ) {
        return filePath;
    }
    return path.resolve(cwd, filePath );
}
// #endregion


// #region postcss
const stubPostcssProcessor = {
    process: function(css: any) {
        return { css };
    }
};
export function getPostcss( options?: false | 'auto' | [] | PostcssProcessor ) : PostcssProcessor {
    const pkgName = 'postcss';

    if (options === undefined || options === false) {
        return <PostcssProcessor>stubPostcssProcessor;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const postcss = require(pkgName);

    if (options === 'auto') {
        if ( fs.existsSync('postcss.config.js')) {
            const plugins = requireUserFile('postcss.config.js').plugins;
            return postcss(plugins);
        }
    }

    if (isArray(options)) {
        return postcss(options);
    }

    return postcss();

}
// #endregion


// #region sass compiler
// #endregion


// #region templated path
function replacer(value?: string | { toString(): string } | Function, allowEmpty?: boolean) {

    function fn(match: string, input: string) {

        if (_.isFunction(value)) {
            // eslint-disable-next-line no-param-reassign
            value = value();
        }

        if (_.isNil(value)) {
            if (!allowEmpty) {
                throw new Error(
                    `Variable ${match} not implemented in this context: ${input}`
                );
            }
            return '';
        }

        return `${value}`;
    }

    return fn;
}

function getHash( content: string ) {
    const hash = crypto.createHash('sha256');
    hash.update(content);

    return hash.digest('hex');
}

const resultFilters = new Map();
resultFilters.set('toLower', function(str: string) { return str.toLowerCase(); } );
resultFilters.set('toUpper', function(str: string) { return str.toUpperCase(); } );

export function parsePath( filePath: string) {

    // eslint-disable-next-line no-param-reassign
    filePath = path.posix.normalize(filePath);

    const pathData = <PathData> {};
    const parsedPath = path.posix.parse(filePath);

    // for /some/path/file.js:
    // [fullPath] - /some/path/file.js
    // [path] - /some/path
    // [base] - file.js
    // [name] - file
    // [ext] - .js

    pathData.fullPath = filePath;
    pathData.path = parsedPath.dir;
    pathData.base = parsedPath.base;
    pathData.name = parsedPath.name;
    pathData.ext = parsedPath.ext;

    if (fs.existsSync(filePath)) {
        pathData.exists = true;

        const stats = fs.statSync(filePath);

        pathData.size = stats.size;
        pathData.created = stats.birthtime;
        pathData.accessed = stats.atime;
        pathData.modified = stats.mtime;
        pathData.changed = stats.ctime;

        if (stats.isFile() === true) {
            pathData.mime = <string>mime.lookup(pathData.ext);
            pathData.contentHash = getHash(filePath);
        }
    } else {
        pathData.exists = false;
    }

    return <PathData>pathData;
}

export function replacePathVariables( template: string | Function, filePath: string | PathData ) {

    const replacements : Map<string, Function> = new Map();

    let result : string = <string>template;
    let pathData = <PathData>filePath;

    if (filePath) {

        if (isString(filePath)) {
            pathData = <PathData>parsePath(filePath);
        }

        replacements.set('fullPath', replacer(pathData.fullPath));
        replacements.set('path', replacer(pathData.path, true));
        replacements.set('base', replacer(pathData.base));
        replacements.set('name', replacer(pathData.name));
        replacements.set('ext', replacer(pathData.ext, true));

        replacements.set('size', replacer(pathData.size, true));
        replacements.set('created', replacer(pathData.created?.getTime(), true));
        replacements.set('accessed', replacer(pathData.accessed?.getTime(), true));
        replacements.set('changed', replacer(pathData.changed?.getTime(), true));
        replacements.set('modified', replacer(pathData.modified?.getTime(), true));

        replacements.set('mime', replacer(pathData.mime, true));
        replacements.set('contentHash', replacer(pathData.contentHash, true));
    }

    if (_.isFunction(template)) {
        result = template(filePath);
    }

    result = result.replace( REGEX_REPLACER_TEMPLATE, ( match, key : string, filters : string | any[] ) => {
        const replacer = replacements.get( key );
        let replaced : string;

        // eslint-disable-next-line no-param-reassign
        filters = (filters === undefined) ? [] : (<string>filters).split(':');

        if (replacer !== undefined) {
            replaced = replacer( key, result );

            (<string[]>filters).forEach(filter => {

                if (filter === '..' || filter === '') {
                    return;
                }

                // Named filters
                if (resultFilters.has(filter)) {
                    const filterFn = resultFilters.get(filter);
                    replaced = filterFn(replaced);
                    return;
                }

                // Early exit
                if (/[a-zA-z]|[^\d\-\\.]/.test(filter)) {
                    return;
                }

                const tuple = filter.split('..', 2);

                // Range filter
                if (tuple.length === 2) {
                    let startIndex = parseInt(tuple[0]);
                    let endIndex = parseInt(tuple[1]);

                    if (Number.isNaN(startIndex)) {
                        startIndex = 0;
                    }
                    if (Number.isNaN(endIndex)) {
                        endIndex = Infinity;
                    }

                    if (startIndex > 0) {
                        startIndex = startIndex - 1;
                    }

                    if (endIndex < 0 && startIndex < 0) {
                        endIndex = endIndex + 1;

                        if (endIndex === 0) {
                            endIndex = Infinity;
                        }
                    }

                    replaced = replaced.slice( startIndex, endIndex);
                    return;
                }

                // Length filter
                const index = parseInt(tuple[0]);
                if (index < 0) {
                    replaced = replaced.slice(index);
                    return;
                }
                replaced = replaced.slice(0, index );
                return;
            });

            return replaced;
        }

        return match;
    });

    return result;
}

// #endregion
