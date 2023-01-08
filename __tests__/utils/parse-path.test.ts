/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import { describe, test } from 'mocha';
import { parsePath } from '../../src/utils';

const testPaths: Record<string, PathData> = {
    'some/path/file.js': <PathData> {
        fullPath: 'some/path/file.js',
        path: 'some/path',
        base: 'file.js',
        name: 'file',
        ext: '.js'
    },
    './some/path/file.js': <PathData> {
        fullPath: 'some/path/file.js',
        path: 'some/path',
        base: 'file.js',
        name: 'file',
        ext: '.js'
    },
    '../some/path/file.js': <PathData> {
        fullPath: '../some/path/file.js',
        path: '../some/path',
        base: 'file.js',
        name: 'file',
        ext: '.js'
    },
    '../some/path/../file.js': <PathData> {
        fullPath: '../some/file.js',
        path: '../some',
        base: 'file.js',
        name: 'file',
        ext: '.js'
    },
    '/some/path/file.js': <PathData> {
        fullPath: '/some/path/file.js',
        path: '/some/path',
        base: 'file.js',
        name: 'file',
        ext: '.js'
    },
    '/some/path/../file.js': <PathData> {
        fullPath: '/some/file.js',
        path: '/some',
        base: 'file.js',
        name: 'file',
        ext: '.js'
    }
};

describe( 'utils', () => {

    describe( 'parsePath()', () => {

        Object.entries(testPaths).forEach( entry => {
            const [ filePath, expected ] = entry;

            test(`should parse ${filePath} correctly`, () => {
                const pathData = parsePath(filePath);
                assert.equal(pathData.fullPath, expected.fullPath);
                assert.equal(pathData.path, expected.path);
                assert.equal(pathData.base, expected.base);
                assert.equal(pathData.name, expected.name);
                assert.equal(pathData.ext, expected.ext);
            });
        });

    });

});
