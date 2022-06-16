/// <reference path="../../lib/types/index.d.ts" />

import assert from 'assert';
import { parsePath } from '../../src/utils';

describe( 'utils', () => {

    describe( 'parsePath()', () => {

        const testPaths : Record<string, Partial<PathData>> = {
            'some/path/file.js': {
                fullPath: 'some/path/file.js',
                path: 'some/path',
                base: 'file.js',
                name: 'file',
                ext: '.js'
            },
            './some/path/file.js': {
                fullPath: 'some/path/file.js',
                path: 'some/path',
                base: 'file.js',
                name: 'file',
                ext: '.js'
            },
            '../some/path/file.js': {
                fullPath: '../some/path/file.js',
                path: '../some/path',
                base: 'file.js',
                name: 'file',
                ext: '.js'
            },
            '../some/path/../file.js': {
                fullPath: '../some/file.js',
                path: '../some',
                base: 'file.js',
                name: 'file',
                ext: '.js'
            },
            '/some/path/file.js': {
                fullPath: '/some/path/file.js',
                path: '/some/path',
                base: 'file.js',
                name: 'file',
                ext: '.js'
            },
            '/some/path/../file.js': {
                fullPath: '/some/file.js',
                path: '/some',
                base: 'file.js',
                name: 'file',
                ext: '.js'
            }
        };

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
