/// <reference path="../../types/index.d.ts" />

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { execSync } from 'child_process';
import { describe, test } from 'mocha';

const VERSION = JSON.parse(
    fs.readFileSync(
        path.resolve( __dirname, '../../package.json' ), 'utf8'
    )
).version;

function _exec( command ) {
    return execSync( command, { stdio: 'pipe' } );
}


describe( 'cli', () => {

    describe( '--version', () => {

        test( 'version is correct', () => {
            const rawResult = _exec( 'node ./bin/sass-build.js --version' );
            const result = rawResult.toString().trim();

            assert.strictEqual( result, VERSION );
        });

    });

});
