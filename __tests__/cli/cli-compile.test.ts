/// <reference path="../../types/index.d.ts" />

import assert from 'assert';

import { validateParams } from '../../src/cli/commands/compile/validate-params';

const PARAMS : {
    file?: string | string[],
    source?: string | string[],
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

        test( '--source', () => {
            PARAMS.source = 'foo';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 0 );
            assert.strictEqual( error, undefined );
        });


        // Incorrect usage
        test( 'no --file or --source', () => {
            PARAMS.file = undefined;
            PARAMS.source = undefined;

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'Supply either --file or --source.'
            );
        });

        test( '--file array', () => {
            PARAMS.file = [ 'foo', 'bar' ];

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--file must be string.'
            );
        });

        test( '--file --outFile', () => {
            PARAMS.file = 'foo';
            PARAMS.outFile = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'Do not supply --outFile or --outDir.'
            );
        });

        test( '--file --outDir', () => {
            PARAMS.file = 'foo';
            PARAMS.outDir = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'Do not supply --outFile or --outDir.'
            );
        });

        test( '--source array', () => {
            PARAMS.source = [ 'foo', 'bar' ];

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                '--source must be string.'
            );
        });

        test( '--source --outFile', () => {
            PARAMS.source = 'foo';
            PARAMS.outFile = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'Do not supply --outFile or --outDir.'
            );
        });

        test( '--source --outDir', () => {
            PARAMS.source = 'foo';
            PARAMS.outDir = 'bar';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'Do not supply --outFile or --outDir.'
            );
        });

    });

});
