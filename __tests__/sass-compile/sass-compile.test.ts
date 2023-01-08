/// <reference path="../../types/index.d.ts" />

import path from 'path';
import assert from 'assert';
import { describe, test, before, beforeEach } from 'mocha';
import { sassCompile } from '../../src/compile';
import { logger } from '../../src/utils';

const FIXTURES_PATH = path.resolve( __dirname, '../__fixtures__' );
const file = `${FIXTURES_PATH}/file.scss`;
const importFile = `${FIXTURES_PATH}/import-file.scss`;
const useFile = `${FIXTURES_PATH}/use-file.scss`;
const importNested = `${FIXTURES_PATH}/import-nested.scss`;
const useNested = `${FIXTURES_PATH}/use-nested.scss`;

const compilerOptions = <SassCompilerOptions> {};
const sassOptions = <SassOptions> {};


describe( 'node-sass', () => {

    before(() => {
        logger.level = 'error';
    });

    beforeEach(() => {
        Object.keys( compilerOptions ).forEach( key => delete compilerOptions[key] );
        Object.keys( sassOptions ).forEach( key => delete sassOptions[key] );

        compilerOptions.compiler = 'node-sass';
        compilerOptions.api = 'legacy';
        compilerOptions.sassOptions = sassOptions;
    });


    test( 'compiles', () => {
        const fileContent = sassCompile( file, compilerOptions );
        assert.notEqual( fileContent, '' );
    });


    test( 'import file', () => {
        const fileContent = sassCompile( importFile, compilerOptions );
        assert.equal( fileContent, 'body {\n    color: red;\n}\n' );
    });

    test( 'import nested', () => {
        const fileContent = sassCompile( importNested, compilerOptions );
        assert.equal( fileContent, 'body {\n    color: blue;\n}\n' );
    });


    test( 'minify: true', () => {
        sassOptions.minify = true;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body{color:red}\n' );
    });

    test( 'minify: false', () => {
        sassOptions.minify = false;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body {\n    color: red;\n}\n' );
    });

});


describe( 'dart-sass', () => {

    before(() => {
        logger.level = 'error';
    });

    beforeEach(() => {
        Object.keys( compilerOptions ).forEach( key => delete compilerOptions[key] );
        Object.keys( sassOptions ).forEach( key => delete sassOptions[key] );

        compilerOptions.compiler = 'sass';
        compilerOptions.api = 'legacy';
        compilerOptions.sassOptions = sassOptions;
    });


    test( 'compiles', () => {
        const fileContent = sassCompile( file, compilerOptions );
        assert.notEqual( fileContent, '' );
    });

    test( 'compiles modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( file, compilerOptions );
        assert.notEqual( fileContent, '' );
    });


    test( 'import file', () => {
        const fileContent = sassCompile( importFile, compilerOptions );
        assert.equal( fileContent, 'body {\n    color: red;\n}' );
    });

    test( 'import file modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( importFile, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: red;\n}' );
    });

    test( 'import nested', () => {
        const fileContent = sassCompile( importNested, compilerOptions );
        assert.equal( fileContent, 'body {\n    color: blue;\n}' );
    });

    test( 'import nested modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( importNested, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: blue;\n}' );
    });


    test( 'use file', () => {
        const fileContent = sassCompile( useFile, compilerOptions );
        assert.equal( fileContent, 'body {\n    color: red;\n}' );
    });

    test( 'use file modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( useFile, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: red;\n}' );
    });

    test( 'use nested', () => {
        const fileContent = sassCompile( useNested, compilerOptions );
        assert.equal( fileContent, 'body {\n    color: blue;\n}' );
    });

    test( 'use nested modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( useNested, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: blue;\n}' );
    });


    test( 'minify: true', () => {
        sassOptions.minify = true;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body{color:red}' );
    });

    test( 'minify: true modern', () => {
        compilerOptions.api = 'modern';
        sassOptions.minify = true;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body{color:red}' );
    });

    test( 'minify: false', () => {
        sassOptions.minify = false;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body {\n    color: red;\n}' );
    });

    test( 'minify: false modern', () => {
        compilerOptions.api = 'modern';
        sassOptions.minify = false;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body {\n  color: red;\n}' );
    });

});


describe( 'sass-embedded', () => {

    before(() => {
        logger.level = 'error';
    });

    beforeEach(() => {
        Object.keys( compilerOptions ).forEach( key => delete compilerOptions[key] );
        Object.keys( sassOptions ).forEach( key => delete sassOptions[key] );

        compilerOptions.compiler = 'sass-embedded';
        compilerOptions.api = 'legacy';
        compilerOptions.sassOptions = sassOptions;
    });


    test( 'compiles', () => {
        const fileContent = sassCompile( file, compilerOptions );
        assert.notEqual( fileContent, '' );
    });

    test( 'compiles modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( file, compilerOptions );
        assert.notEqual( fileContent, '' );
    });


    test( 'import file', () => {
        const fileContent = sassCompile( importFile, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: red;\n}' );
    });

    test( 'import file modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( importFile, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: red;\n}' );
    });

    test( 'import nested', () => {
        const fileContent = sassCompile( importNested, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: blue;\n}' );
    });

    test( 'import nested modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( importNested, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: blue;\n}' );
    });


    test( 'use file', () => {
        const fileContent = sassCompile( useFile, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: red;\n}' );
    });

    test( 'use file modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( useFile, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: red;\n}' );
    });

    test( 'use nested', () => {
        const fileContent = sassCompile( useNested, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: blue;\n}' );
    });

    test( 'use nested modern', () => {
        compilerOptions.api = 'modern';
        const fileContent = sassCompile( useNested, compilerOptions );
        assert.equal( fileContent, 'body {\n  color: blue;\n}' );
    });


    test( 'minify: true', () => {
        sassOptions.minify = true;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body{color:red}' );
    });

    test( 'minify: true modern', () => {
        compilerOptions.api = 'modern';
        sassOptions.minify = true;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body{color:red}' );
    });

    test( 'minify: false', () => {
        sassOptions.minify = false;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body {\n  color: red;\n}' );
    });

    test( 'minify: false modern', () => {
        compilerOptions.api = 'modern';
        sassOptions.minify = false;
        const fileContent = sassCompile( file, compilerOptions );

        assert.equal( fileContent, 'body {\n  color: red;\n}' );
    });

});
