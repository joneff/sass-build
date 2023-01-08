/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import { describe, test } from 'mocha';
import { isArray } from '../../src/utils';

describe( 'utils', () => {

    describe( 'isArray()', () => {

        test('should return true for arrays', () => {
            assert.strictEqual(isArray([]), true);
            assert.strictEqual(isArray([ 1, 2, 3 ]), true);
        });

        test('should return false for non-arrays', () => {
            assert.strictEqual(isArray(1), false);
            assert.strictEqual(isArray('string'), false);
            assert.strictEqual(isArray({}), false);
            assert.strictEqual(isArray(null), false);
            assert.strictEqual(isArray(undefined), false);
        });

    });

});
