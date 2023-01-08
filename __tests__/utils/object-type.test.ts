/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import { describe, test } from 'mocha';
import { objectType } from '../../src/utils';

describe( 'utils', () => {

    describe( 'objectType()', () => {

        test('should return "array" for arrays', () => {
            assert.strictEqual(objectType([]), 'array');
            assert.strictEqual(objectType([ 1, 2, 3 ]), 'array');
        });

        test('should return "object" for objects', () => {
            assert.strictEqual(objectType({}), 'object');
            assert.strictEqual(objectType({ a: 1, b: 2, c: 3 }), 'object');
        });

        test('should return "string" for strings', () => {
            assert.strictEqual(objectType(''), 'string');
            assert.strictEqual(objectType('string'), 'string');
        });

        test('should return "number" for numbers', () => {
            assert.strictEqual(objectType(1), 'number');
            assert.strictEqual(objectType(1.1), 'number');
        });

        test('should return "Nan" for Nan', () => {
            assert.strictEqual(objectType(NaN), 'NaN');
        });

        test('should return "boolean" for booleans', () => {
            assert.strictEqual(objectType(true), 'boolean');
            assert.strictEqual(objectType(false), 'boolean');
        });

        test('should return "null" for null', () => {
            assert.strictEqual(objectType(null), 'null');
        });

        test('should return "undefined" for undefined', () => {
            assert.strictEqual(objectType(undefined), 'undefined');
        });

    });

});
