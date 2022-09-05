/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import { replacePathVariables } from '../../src/utils';

describe( 'utils', () => {

    describe( 'replacePathVariables()', () => {

        const testPaths : Record<string, object> = {
            'path/to/some/DIR': {
                '[fullPath]': 'path/to/some/DIR',
                '[path]': 'path/to/some',
                '[base]': 'DIR',
                '[name]': 'DIR',
                '[name:toLower]': 'dir',
                '[ext]': '',
                '[size]': '',
                '[created]': '',
                '[accessed]': '',
                '[modified]': '',
                '[changed]': '',
                '[mime]': '',
                '[contentHash]': ''
            },
            '__tests__/__fixtures__/file.txt': {
                '[fullPath]': '__tests__/__fixtures__/file.txt',
                '[path]': '__tests__/__fixtures__',
                '[base]': 'file.txt',
                '[name]': 'file',
                '[ext]': '.txt',
                '[size]': '12',
                // '[created]': '1655110731000',
                // '[accessed]': '1661357377934',
                // '[modified]': '1655110731000',
                // '[changed]': '1661357376503',
                '[mime]': 'text/plain',
                '[mime:..]': 'text/plain',
                '[mime:4]': 'text',
                '[mime:-5]': 'plain',
                '[mime:1..]': 'text/plain',
                '[mime:..4]': 'text',
                '[mime:1..4]': 'text',
                '[mime:-5..]': 'plain',
                '[mime:..-5]': 'text/',
                '[mime:-3..-2]': 'ai',
                '[mime:-3..-1]': 'ain',
                '[mime:toUpper]': 'TEXT/PLAIN',
                // '[contentHash]': 'eb70a50d69f0578705480fa975f4abd3602830469c99f42409657fa79cd86382',
                // '[contentHash:6]': 'eb70a5',
                // '[contentHash:2..4]': 'b70',
                // '[contentHash:..4]': 'eb70',
                // '[contentHash:..4:toUpper]': 'EB70',
            }
        };

        Object.entries(testPaths).forEach(testPath => {
            const [ filePath, meta ] = testPath;

            Object.entries(meta).forEach(entry => {
                const [ template, expected ] = entry;

                test(`should replace ${template}`, () => {
                    const result = replacePathVariables(template, filePath);
                    assert.equal(result, expected);
                });

            });

        });

    });

});
