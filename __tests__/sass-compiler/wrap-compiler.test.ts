/// <reference path="../../lib/types/index.d.ts" />

import assert from 'assert';
import { wrapCompiler } from '../../src';

describe( 'sass-compiler', () => {

    describe( 'wrapCompiler()', () => {

        const NODE_SASS = 'node-sass';
        const DART_SASS = 'dart-sass';
        const SASS_EMBEDDED = 'sass-embedded';
        const EMPTY_OPTS = <CliOptions>{};

        test('Default wrapper compiler is node-sass', () => {
            const compiler = wrapCompiler( EMPTY_OPTS );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, NODE_SASS);
        });

        test(`Setting compiler name to 'node-sass' works correctly`, () => {
            const compiler = wrapCompiler( { implementation: 'node-sass' } as CliOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, NODE_SASS);
        });

        test(`Setting compiler name to 'sass' works correctly`, () => {
            const compiler = wrapCompiler( { implementation: 'sass' } as CliOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, DART_SASS);
        });

        test(`Setting compiler name to 'sass-embedded' works correctly`, () => {
            const compiler = wrapCompiler( { implementation: 'sass-embedded' } as CliOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, SASS_EMBEDDED);
        });

        test(`Setting compiler name to require('node-sass') works correctly`, () => {
            const compiler = wrapCompiler( { implementation: require('node-sass') } as CliOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, NODE_SASS);
        });

        test(`Setting compiler name to require('sass') works correctly`, () => {
            const compiler = wrapCompiler( { implementation: require('sass') } as CliOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, DART_SASS);
        });

        test(`Setting compiler name to require('sass-embedded') works correctly`, () => {
            const compiler = wrapCompiler( { implementation: require('sass-embedded') } as CliOptions );
            const compilerName = compiler.info.split('\t')[0];

            assert.equal(compilerName, SASS_EMBEDDED);
        });

        test('Setting invalid compiler throws an error', () => {
            assert.throws( () => {
                wrapCompiler( { implementation: '' } as CliOptions );
            });
            assert.throws( () => {
                wrapCompiler( { implementation: 'glob' } as CliOptions );
            });
            assert.throws( () => {
                wrapCompiler( { implementation: 'no-such-compiler' } as CliOptions );
            });
            assert.throws( () => {
                wrapCompiler( { implementation: require('glob') } as CliOptions );
            });
        });

    });

});
