/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import { execSync } from 'child_process';

import { validateParams } from '../../src/cli/commands/info/validate-params';

const INFO = `
The following sass compilers are installed:
- node-sass\t8.0.0
- dart-sass\t1.56.1
- sass-embedded\t1.56.1
`.trim();

const PARAMS : {
    file?: string | string[],
    source?: string,
    glob?: string | string[],
    outFile?: string,
    outDir?: string
} = {
    file: undefined,
    source: undefined,
    glob: undefined,
    outFile: undefined,
    outDir: undefined
};
const errStack : Error[] = [];

function _validateParams() {
    try {
        validateParams( PARAMS );
    } catch ( error ) {
        errStack.push( error );
    }

    return errStack[0];
}


describe( 'cli > info', () => {

    test( 'sass-build info', () => {
        const rawResult = execSync( 'node ./bin/sass-build.js info' );
        const result = rawResult.toString().trim();

        assert.strictEqual( result, INFO );
    });


    describe( 'validate params', () => {

        beforeEach( () => {
            errStack.length = 0;

            Object.keys( PARAMS ).forEach( key => {
                delete PARAMS[key];
            });
        });

        // Correct usage
        test( 'no additional parameters passed', () => {
            const error = _validateParams();

            assert.strictEqual( errStack.length, 0 );
            assert.strictEqual( error, undefined );
        });

        test( 'undefined parameters passed', () => {
            PARAMS.file = undefined;
            PARAMS.source = undefined;
            PARAMS.glob = undefined;
            PARAMS.outFile = undefined;
            PARAMS.outDir = undefined;

            const error = _validateParams();

            assert.strictEqual( errStack.length, 0 );
            assert.strictEqual( error, undefined );
        });


        // Incorrect usage
        test( 'empty parameters passed', () => {
            PARAMS.file = '';
            PARAMS.source = '';
            PARAMS.glob = '';
            PARAMS.outFile = '';
            PARAMS.outDir = '';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'Command "info" does not accept additional parameters.'
            );
        });

        test( 'any parameters passed', () => {
            PARAMS.file = 'foo';

            const error = _validateParams();

            assert.strictEqual( errStack.length, 1 );
            assert.strictEqual(
                error.message,
                'Command "info" does not accept additional parameters.'
            );
        });

    });


});
