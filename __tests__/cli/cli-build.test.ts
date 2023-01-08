/// <reference path="../../types/index.d.ts" />

import fs from 'fs';
import assert from 'assert';
import { execSync } from 'child_process';
import { describe, test, before, beforeEach, after } from 'mocha';

import { logger } from '../../src/utils';
import { validateParams } from '../../src/cli/commands/build/validate-params';

const PARAMS : {
    file?: string | string[],
    source?: string,
    glob?: string | string[],
    outFile?: string,
    outDir?: string
} = {};
const errStack : Error[] = [];

const file = '__tests__/__fixtures__/file.scss';
const source = fs.readFileSync( file, 'utf-8' ).replace( '\n', '' );
const outFile = '__tests__/__fixtures__/dist/file.css';
const distFile = 'dist/file.css';
const outDir = '__tests__/__fixtures__/dist';
const fileCssContent = 'body {\n    color: red;\n}\n';
const sourceCssContent = fileCssContent;

function _validateParams() {
    try {
        validateParams( PARAMS );
    } catch ( error ) {
        errStack.push( error );
    }

    return errStack[0];
}

function _exec( command ) {
    return execSync( command, { stdio: 'pipe' } );
}

function cleanDist() {
    fs.rmSync( distFile, { force: true } );
    fs.rmSync( outDir, { recursive: true, force: true } );
}


describe( 'cli', () => {

    before(() => {
        logger.level = 'error';

        cleanDist();
    });

    after(() => {
        cleanDist();
    });

    beforeEach( () => {
        logger.level = 'error';

        cleanDist();
    });

    describe( '!build', () => {

        describe( 'run', () => {

            test( 'sass-build --file', () => {
                _exec( `node ./bin/sass-build.js --file ${file}` );

                assert.ok( fs.existsSync( distFile ) );
                assert.equal( fs.readFileSync( distFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build --file --outFile', () => {
                _exec( `node ./bin/sass-build.js --file ${file} --outFile ${outFile}` );

                assert.ok( fs.existsSync( outFile ) );
                assert.equal( fs.readFileSync( outFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build --file --outDir', () => {
                _exec( `node ./bin/sass-build.js --file ${file} --outDir ${outDir}` );

                assert.ok( fs.existsSync( outFile ) );
                assert.equal( fs.readFileSync( outFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build --file --file', () => {
                _exec( `node ./bin/sass-build.js --file ${file} --file ${file}` );

                assert.ok( fs.existsSync( distFile ) );
                assert.equal( fs.readFileSync( distFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build --file --file --outDir', () => {
                _exec( `node ./bin/sass-build.js --file ${file} --file ${file} --outDir ${outDir}` );

                assert.ok( fs.existsSync( outFile ) );
                assert.equal( fs.readFileSync( outFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build --source --outFile', () => {
                _exec( `node ./bin/sass-build.js --source '${source}' --outFile ${outFile}` );

                assert.ok( fs.existsSync( outFile ) );
                assert.equal( fs.readFileSync( outFile, 'utf8' ), sourceCssContent );
            });

            test( 'sass-build build --file', () => {
                _exec( `node ./bin/sass-build.js build --file ${file}` );

                assert.ok( fs.existsSync( distFile ) );
                assert.equal( fs.readFileSync( distFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build build --file --outFile', () => {
                _exec( `node ./bin/sass-build.js build --file ${file} --outFile ${outFile}` );

                assert.ok( fs.existsSync( outFile ) );
                assert.equal( fs.readFileSync( outFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build build --file --outDir', () => {
                _exec( `node ./bin/sass-build.js build --file ${file} --outDir ${outDir}` );

                assert.ok( fs.existsSync( outFile ) );
                assert.equal( fs.readFileSync( outFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build build --file --file', () => {
                _exec( `node ./bin/sass-build.js build --file ${file} --file ${file}` );

                assert.ok( fs.existsSync( distFile ) );
                assert.equal( fs.readFileSync( distFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build build --file --file --outDir', () => {
                _exec( `node ./bin/sass-build.js build --file ${file} --file ${file} --outDir ${outDir}` );

                assert.ok( fs.existsSync( outFile ) );
                assert.equal( fs.readFileSync( outFile, 'utf8' ), fileCssContent );
            });

            test( 'sass-build build --source --outFile', () => {
                _exec( `node ./bin/sass-build.js build --source '${source}' --outFile ${outFile}` );

                assert.ok( fs.existsSync( outFile ) );
                assert.equal( fs.readFileSync( outFile, 'utf8' ), sourceCssContent );
            });

        });


        describe( 'validate params', () => {

            beforeEach( () => {
                errStack.length = 0;

                Object.keys( PARAMS ).forEach( key => {
                    delete PARAMS[key];
                });
            });

            describe( 'correct usage', () => {

                test( '--file', () => {
                    PARAMS.file = 'foo';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 0 );
                    assert.strictEqual( error, undefined );
                });

                test( '--file array', () => {
                    PARAMS.file = [ 'foo', 'bar' ];

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 0 );
                    assert.strictEqual( error, undefined );
                });

                test( '--file --outFile', () => {
                    PARAMS.file = 'foo';
                    PARAMS.outFile = 'bar';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 0 );
                    assert.strictEqual( error, undefined );
                });

                test( '--file --outDir', () => {
                    PARAMS.file = 'foo';
                    PARAMS.outDir = 'bar';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 0 );
                    assert.strictEqual( error, undefined );
                });

                test( '--file array --outDir', () => {
                    PARAMS.file = [ 'foo', 'bar' ];
                    PARAMS.outDir = 'baz';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 0 );
                    assert.strictEqual( error, undefined );
                });

                test( '--source --outFile', () => {
                    PARAMS.source = 'foo';
                    PARAMS.outFile = 'bar';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 0 );
                    assert.strictEqual( error, undefined );
                });

                test( '--glob', () => {
                    PARAMS.glob = 'foo';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 0 );
                    assert.strictEqual( error, undefined );
                });

                test( '--glob array', () => {
                    PARAMS.glob = [ 'foo', 'bar' ];

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 0 );
                    assert.strictEqual( error, undefined );
                });

                test( '--glob --outDir', () => {
                    PARAMS.glob = 'foo';
                    PARAMS.outDir = 'bar';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 0 );
                    assert.strictEqual( error, undefined );
                });

            });


            describe( 'incorrect usage', () => {

                test( 'no params', () => {
                    PARAMS.file = undefined;
                    PARAMS.source = undefined;
                    PARAMS.glob = undefined;

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 1 );
                    assert.strictEqual(
                        error.message,
                        'Supply either --file, --source or --glob.'
                    );
                });

                test( '--file array --outFile', () => {
                    PARAMS.file = [ 'foo', 'bar' ];
                    PARAMS.outFile = 'baz';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 1 );
                    assert.strictEqual(
                        error.message,
                        'Supply --outDir instead of --outFile.'
                    );
                });

                test( '--source', () => {
                    PARAMS.source = 'foo';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 1 );
                    assert.strictEqual(
                        error.message,
                        'Supply --outFile.'
                    );
                });

                test( '--glob --outFile', () => {
                    PARAMS.glob = 'foo';
                    PARAMS.outFile = 'bar';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 1 );
                    assert.strictEqual(
                        error.message,
                        'Supply --outDir instead of --outFile.'
                    );
                });

                test( '--glob array --outFile', () => {
                    PARAMS.glob = [ 'foo', 'bar' ];
                    PARAMS.outFile = 'baz';

                    const error = _validateParams();

                    assert.strictEqual( errStack.length, 1 );
                    assert.strictEqual(
                        error.message,
                        'Supply --outDir instead of --outFile.'
                    );
                });

            });

        });

    });

});
