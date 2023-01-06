/// <reference path="../../types/index.d.ts" />

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { execSync } from 'child_process';
import argsParser from 'yargs-parser';

import { validateParams } from '../../src/cli/validate-params';

const VERSION = JSON.parse(
    fs.readFileSync(
        path.resolve( __dirname, '../../package.json' ), 'utf8'
    )
).version;
const ARGS : argsParser.Arguments = {
    _: []
};
const ARGS_OPTIONS : argsParser.Options = {
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
const errStack: Error[] = [];

function _validateParams() {
    try {
        validateParams( ARGS, ARGS_OPTIONS );
    } catch ( error ) {
        errStack.push( error );
    }

    return errStack[0];
}


describe( 'cli', () => {

    test( 'sass-build (no params)', () => {
        const rawResult = execSync( 'node ./bin/sass-build.js' );
        const result = rawResult.toString().trim();

        assert.strictEqual( result, 'No command passed and no default config found!' );
    });

    test( 'sass-build --version', () => {
        const rawResult = execSync( 'node ./bin/sass-build.js --version' );
        const result = rawResult.toString().trim();

        assert.strictEqual( result, VERSION );
    });


    describe( 'validate params', () => {

        beforeEach( () => {
            errStack.length = 0;

            Object.keys( ARGS ).forEach( key => {
                delete ARGS[key];
            });

            ARGS._ = [];
        });


        // Incorrect usage
        test( 'more than one command is passed', () => {
            ARGS._ = [ 'info', 'build' ];

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'More than one command passed.'
            );
        });

        test( 'unknown parameters', () => {
            ARGS.foo = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'Unknown parameters passed.'
            );
        });

        test( 'version and command', () => {
            ARGS.version = true;
            ARGS._ = [ 'info' ];

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--version parameter cannot be passed to commands.'
            );
        });

        test( 'version and other params', () => {
            ARGS.version = true;
            ARGS.file = 'foo';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--version parameter cannot be used with other parameters.'
            );
        });

        test( 'version and config', () => {
            ARGS.version = true;
            ARGS.config = 'foo';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--version parameter cannot be used with other parameters.'
            );
        });

        test( 'version and debug', () => {
            ARGS.version = true;
            ARGS.debug = true;

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--version parameter cannot be used with other parameters.'
            );
        });

        test( 'empty command', () => {
            ARGS._ = [ '' ];

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'Command name is empty.'
            );
        });

        test( 'unknown command', () => {
            ARGS._ = [ 'foo' ];

            const error = _validateParams();
            assert.strictEqual(
                error.message,
                'Command not found: foo.'
            );

            assert.strictEqual( errStack.length, 1 );
        });

        test( 'info and debug', () => {
            ARGS._ = [ 'info' ];
            ARGS.debug = true;

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--debug parameter cannot be passed to "info" command.'
            );
        });

        test( 'command and config', () => {
            ARGS._ = [ 'info' ];
            ARGS.config = 'foo';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--config parameter cannot be passed to commands.'
            );
        });

        test( 'config and extra params', () => {
            ARGS.config = 'foo';
            ARGS.file = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--config parameter cannot be used with other parameters.'
            );
        });

        test( 'file and source', () => {
            ARGS.file = 'foo';
            ARGS.source = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--file and --source parameters cannot be used together.'
            );
        });

        test( 'file and glob', () => {
            ARGS.file = 'foo';
            ARGS.glob = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--file and --glob parameters cannot be used together.'
            );
        });

        test( 'source and glob', () => {
            ARGS.source = 'foo';
            ARGS.glob = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--source and --glob parameters cannot be used together.'
            );
        });

        test( 'outFile and outDir', () => {
            ARGS.outFile = 'foo';
            ARGS.outDir = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--outFile and --outDir parameters cannot be used together.'
            );
        });

    });

});
