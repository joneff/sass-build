/// <reference path="../../types/index.d.ts" />

import fs from 'fs';
import assert from 'assert';
import { describe, test, before, beforeEach, after } from 'mocha';
import { sassBuild, sassBuildString } from '../../src/build';
import { logger } from '../../src/utils';

const file = '__tests__/__fixtures__/file.scss';
const source = fs.readFileSync( file, 'utf8' );
const outFile = '__tests__/__fixtures__/dist/file.css';
const distFile = 'dist/file.css';
const outDir = '__tests__/__fixtures__/dist';
const fileCssContent = 'body {\n    color: red;\n}\n';
const sourceCssContent = fileCssContent;

function cleanDist() {
    fs.rmSync( distFile, { force: true } );
    fs.rmSync( outDir, { recursive: true, force: true } );
}

const COMPILER_OPTIONS = <SassCompilerOptions> {};

describe( 'sassBuild', () => {

    before(() => {
        logger.level = 'error';

        cleanDist();
    });

    after(() => {
        cleanDist();
    });

    beforeEach(() => {
        Object.keys( COMPILER_OPTIONS ).forEach( key => {
            delete COMPILER_OPTIONS[key];
        });

        cleanDist();
    });


    describe( 'defaults', () => {

        test( 'file', () => {
            sassBuild( file, outFile );
            const result = fs.readFileSync( outFile, 'utf8' );

            assert.ok( fs.existsSync( outFile ) );
            assert.equal( result, fileCssContent );
        });

        test( 'source', () => {
            sassBuildString( source, outFile );
            const result = fs.readFileSync( outFile, 'utf8' );

            assert.ok( fs.existsSync( outFile ) );
            assert.equal( result, sourceCssContent );
        });

    });


    describe( 'node-sass', () => {

        test( 'file', () => {
            COMPILER_OPTIONS.compiler = 'node-sass';

            sassBuild( file, outFile, COMPILER_OPTIONS );
            const result = fs.readFileSync( outFile, 'utf8' );

            assert.ok( fs.existsSync( outFile ) );
            assert.equal( result, fileCssContent );
        });

        test( 'source', () => {
            COMPILER_OPTIONS.compiler = 'node-sass';

            sassBuildString( source, outFile, COMPILER_OPTIONS );
            const result = fs.readFileSync( outFile, 'utf8' );

            assert.ok( fs.existsSync( outFile ) );
            assert.equal( result, sourceCssContent );
        });

    });


    describe( 'dart-sass', () => {

        test( 'file', () => {
            COMPILER_OPTIONS.compiler = 'sass';

            sassBuild( file, outFile, COMPILER_OPTIONS );
            const result = fs.readFileSync( outFile, 'utf8' );

            assert.ok( fs.existsSync( outFile ) );
            assert.equal( result, 'body {\n    color: red;\n}' );
        });

        test( 'source', () => {
            COMPILER_OPTIONS.compiler = 'sass';

            sassBuildString( source, outFile, COMPILER_OPTIONS );
            const result = fs.readFileSync( outFile, 'utf8' );

            assert.ok( fs.existsSync( outFile ) );
            assert.equal( result, 'body {\n    color: red;\n}' );
        });

    });


    describe( 'sass-embedded', () => {

        test( 'file', () => {
            COMPILER_OPTIONS.compiler = 'sass-embedded';

            sassBuild( file, outFile, COMPILER_OPTIONS );
            const result = fs.readFileSync( outFile, 'utf8' );

            assert.ok( fs.existsSync( outFile ) );
            assert.equal( result, 'body {\n  color: red;\n}' );
        });

        test( 'source', () => {
            COMPILER_OPTIONS.compiler = 'sass-embedded';

            sassBuildString( source, outFile, COMPILER_OPTIONS );
            const result = fs.readFileSync( outFile, 'utf8' );

            assert.ok( fs.existsSync( outFile ) );
            assert.equal( result, 'body {\n  color: red;\n}' );
        });

    });

});
