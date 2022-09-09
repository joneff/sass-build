/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import { wrapCompiler } from '../../src';

describe( 'sass-compiler', () => {

    describe( 'wrapCompiler()', () => {

        const NODE_SASS = 'node-sass';
        const DART_SASS = 'dart-sass';
        const SASS_EMBEDDED = 'sass-embedded';
        const EMPTY_OPTS = <CliBuildOptions>{};

        test('Default wrapper compiler is node-sass', () => {
            const compiler = wrapCompiler( EMPTY_OPTS );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, NODE_SASS);
        });

        test(`Setting compiler name to 'node-sass' works correctly`, () => {
            const compiler = wrapCompiler( { compiler: 'node-sass' } as CliBuildOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, NODE_SASS);
        });

        test(`Setting compiler name to 'sass' works correctly`, () => {
            const compiler = wrapCompiler( { compiler: 'sass' } as CliBuildOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, DART_SASS);
        });

        test(`Setting compiler name to 'sass-embedded' works correctly`, () => {
            const compiler = wrapCompiler( { compiler: 'sass-embedded' } as CliBuildOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, SASS_EMBEDDED);
        });

        test(`Setting compiler name to require('node-sass') works correctly`, () => {
            const compiler = wrapCompiler( { compiler: require('node-sass') } as CliBuildOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, NODE_SASS);
        });

        test(`Setting compiler name to require('sass') works correctly`, () => {
            const compiler = wrapCompiler( { compiler: require('sass') } as CliBuildOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, DART_SASS);
        });

        test(`Setting compiler name to require('sass-embedded') works correctly`, () => {
            const compiler = wrapCompiler( { compiler: require('sass-embedded') } as CliBuildOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, SASS_EMBEDDED);
        });

        test('Setting invalid compiler throws an error', () => {
            assert.throws( () => {
                wrapCompiler( { compiler: '' } as CliBuildOptions );
            });
            assert.throws( () => {
                wrapCompiler( { compiler: 'glob' } as CliBuildOptions );
            });
            assert.throws( () => {
                wrapCompiler( { compiler: 'no-such-compiler' } as CliBuildOptions );
            });
            assert.throws( () => {
                wrapCompiler( { compiler: require('glob') } as CliBuildOptions );
            });
        });

    });

});
