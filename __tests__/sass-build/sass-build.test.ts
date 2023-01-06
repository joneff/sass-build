/// <reference path="../../types/index.d.ts" />

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { sassBuild } from '../../src/build';
import { logger, fileExists } from '../../src/utils';

const FIXTURES_PATH = path.resolve( __dirname, '../__fixtures__' );

[ 'modern', 'legacy' ].forEach( apiType => {

    describe( `${apiType}-sass`, () => {

        beforeAll(() => {
            logger.level = 'error';
        });

        beforeEach(() => {
            fs.rmSync( `${FIXTURES_PATH}/dist`, { recursive: true, force: true } );
        });
        afterEach(() => {
            fs.rmSync( `${FIXTURES_PATH}/dist`, { recursive: true, force: true } );
        });

        const opts : Partial<SassCompilerOptions> = {
            api: 'legacy'
        };

        const file = `${FIXTURES_PATH}/simple.scss`;
        const outFile = `${FIXTURES_PATH}/dist/simple.css`;

        describe( 'sassBuild', () => {

            test('sassBuild compiles', () => {
                sassBuild( file, outFile, <SassCompilerOptions> opts );
                assert.equal( fileExists( outFile ), true );
            });

        });

    });

});
