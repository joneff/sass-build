/// <reference path="../../types/index.d.ts" />

import assert from 'assert';

import { validateParams } from '../../src/cli/commands/build/validate-params';

const PARAMS : {
    file?: string | string[],
    source?: string,
    glob?: string | string[],
    outFile?: string,
    outDir?: string
} = {};
const errStack : Error[] = [];

function _validateParams() {
    try {
        validateParams( PARAMS );
    } catch ( error ) {
        errStack.push( error );
    }

    return errStack[0];
}


describe( 'cli > build', () => {

    describe( 'validate params', () => {

        beforeEach( () => {
            errStack.length = 0;

            Object.keys( PARAMS ).forEach( key => {
                delete PARAMS[key];
            });
        });


        // Correct usage
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


        // Incorrect usage
        test( 'no --file, --source or --glob', () => {
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

        test( '--file empty string', () => {
            PARAMS.file = '';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--file must not be empty.'
            );
        });

        test( '--file empty array', () => {
            PARAMS.file = [];

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--file must not be empty.'
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

        test( '--glob empty string', () => {
            PARAMS.glob = '';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--glob must not be empty.'
            );
        });

        test( '--glob empty array', () => {
            PARAMS.glob = [];

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--glob must not be empty.'
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
