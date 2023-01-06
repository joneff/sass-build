/// <reference path="../../types/index.d.ts" />

import path from 'path';
import assert from 'assert';
import { sassCompile } from '../../src/compile';
import { logger } from '../../src/utils';

const FIXTURES_PATH = path.resolve( __dirname, '../__fixtures__' );

[ 'modern', 'legacy' ].forEach( apiType => {

    describe( `${apiType}-sass`, () => {

        beforeAll(() => {
            logger.level = 'error';
        });

        const opts : Partial<SassCompilerOptions> = {
            api: 'legacy'
        };

        const file = `${FIXTURES_PATH}/simple.scss`;
        const nestedFile = `${FIXTURES_PATH}/nested/at-import.scss`;

        describe( 'sassCompile', () => {

            test('sassCompile compiles', () => {
                const fileContent = sassCompile( file, <SassCompilerOptions> opts );
                assert.notEqual( fileContent, '' );
            });

        });

        describe('sassCompile w/ minify', () => {

            test('minify: true', () => {
                const sassOptions : Partial<SassOptions> = { minify: true };
                const fileContent = sassCompile( file, <SassCompilerOptions> { ...opts, sassOptions } );

                assert.equal( fileContent, 'body{color:red}\n' );
            });
            test('minify: false', () => {
                const sassOptions : Partial<SassOptions> = { minify: false };
                const fileContent = sassCompile( file, <SassCompilerOptions> { ...opts, sassOptions } );

                assert.equal( fileContent, 'body {\n    color: red;\n}\n' );
            });

        });

        describe('sassCompile w/ loadPaths', () => {

            test('correct path', () => {
                const sassOptions : Partial<SassOptions> = { loadPaths: [ FIXTURES_PATH ] };
                const fileContent = sassCompile( nestedFile, <SassCompilerOptions> { ...opts, sassOptions } );

                assert.notEqual( fileContent, '' );
            });

        });

    });

});
