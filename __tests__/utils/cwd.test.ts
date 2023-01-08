/// <reference path="../../types/index.d.ts" />

import path from 'path';
import assert from 'assert';
import { describe, test } from 'mocha';
import { CWD, padCwd, trimCwd } from '../../src/utils';

describe( 'utils', () => {

    describe( 'cwd', () => {

        test( 'CWD should equal process.cwd()', () => {
            assert.strictEqual(CWD, process.cwd());
        });

    });


    describe( 'padCwd()', () => {

        test('should pad CWD correctly', () => {
            assert.strictEqual(padCwd(CWD, ''), CWD);
            assert.strictEqual(padCwd(CWD, 'some/path'), `${CWD}/some/path`);
            assert.strictEqual(padCwd(CWD, './some/path'), `${CWD}/some/path`);
            assert.strictEqual(padCwd(CWD, '../some/path'), path.resolve(CWD, `../some/path`));
            assert.strictEqual(padCwd(CWD, '/some/path'), '/some/path');
        });

    });


    describe( 'trimCwd()', () => {

        test('should trim CWD correctly', () => {
            assert.strictEqual(trimCwd(CWD, CWD), '');
            assert.strictEqual(trimCwd(CWD, `${CWD}/some/path`), 'some/path');
            assert.strictEqual(trimCwd(CWD, `${CWD}/../some/path`), '../some/path');
            assert.strictEqual(trimCwd(CWD, '/some/path'), '/some/path');
        });

    });

});
