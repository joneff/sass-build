/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import { describe, test } from 'mocha';
import { isString } from '../../src/utils';

describe( 'utils', () => {

    describe( 'isString()', () => {

        test('should return true for strings', () => {
            assert.strictEqual(isString(''), true);
            assert.strictEqual(isString('string'), true);
        });

        test('should return false for non-strings', () => {
            assert.strictEqual(isString(1), false);
            assert.strictEqual(isString([]), false);
            assert.strictEqual(isString({}), false);
            assert.strictEqual(isString(null), false);
            assert.strictEqual(isString(undefined), false);
        });

    });

});
