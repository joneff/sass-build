/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import { describe, test } from 'mocha';
import { objectTag } from '../../src/utils';

describe('utils', () => {

    describe('objectTag', () => {

        test('should return the correct tag for the given object', () => {
            assert.strictEqual(objectTag({}), '[object Object]');
            assert.strictEqual(objectTag([]), '[object Array]');
            assert.strictEqual(objectTag(() => {}), '[object Function]');
            assert.strictEqual(objectTag(/./), '[object RegExp]');
            assert.strictEqual(objectTag(new Date()), '[object Date]');
            assert.strictEqual(objectTag(new Error()), '[object Error]');
            assert.strictEqual(objectTag(new Map()), '[object Map]');
            assert.strictEqual(objectTag(new Set()), '[object Set]');
            assert.strictEqual(objectTag(new WeakMap()), '[object WeakMap]');
            assert.strictEqual(objectTag(new WeakSet()), '[object WeakSet]');
            assert.strictEqual(objectTag(new ArrayBuffer(2)), '[object ArrayBuffer]');
            assert.strictEqual(objectTag(new Int8Array()), '[object Int8Array]');
            assert.strictEqual(objectTag(new Uint8Array()), '[object Uint8Array]');
            assert.strictEqual(objectTag(new Uint8ClampedArray()), '[object Uint8ClampedArray]');
            assert.strictEqual(objectTag(new Int16Array()), '[object Int16Array]');
            assert.strictEqual(objectTag(new Uint16Array()), '[object Uint16Array]');
            assert.strictEqual(objectTag(new Int32Array()), '[object Int32Array]');
            assert.strictEqual(objectTag(new Uint32Array()), '[object Uint32Array]');
            assert.strictEqual(objectTag(new Float32Array()), '[object Float32Array]');
            assert.strictEqual(objectTag(new Float64Array()), '[object Float64Array]');
            assert.strictEqual(objectTag(new DataView(new ArrayBuffer(2))), '[object DataView]');
            assert.strictEqual(objectTag(new Promise(() => {})), '[object Promise]');
            assert.strictEqual(objectTag(new Proxy({}, {})), '[object Object]');
            assert.strictEqual(objectTag(Object.create(null)), '[object Object]');
        });

        test('should return the correct tag for the given primitive', () => {
            assert.strictEqual(objectTag(''), '[object String]');
            assert.strictEqual(objectTag(1), '[object Number]');
            assert.strictEqual(objectTag(true), '[object Boolean]');
            assert.strictEqual(objectTag(Symbol('')), '[object Symbol]');
            assert.strictEqual(objectTag(null), '[object Null]');
            assert.strictEqual(objectTag(undefined), '[object Undefined]');
        });

        test('should return the correct tag for the given object with a custom toStringTag', () => {
            const obj = { [Symbol.toStringTag]: 'foo' };
            assert.strictEqual(objectTag(obj), '[object foo]');
        });

        test('should return the correct tag for the given primitive with a custom toStringTag', () => {
            const obj = { [Symbol.toStringTag]: 'foo' };
            assert.strictEqual(objectTag(obj), '[object foo]');
        });

    });

});
