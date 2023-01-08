/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import { execSync } from 'child_process';
import { describe, test } from 'mocha';

describe( 'cli', () => {

    test( 'no args', () => {
        const rawResult = execSync( 'node ./bin/sass-build.js' );
        const result = rawResult.toString().trim();

        assert.strictEqual( result, 'No command passed and no default config found!' );
    });

});
