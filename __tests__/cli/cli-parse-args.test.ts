/// <reference path="../../types/index.d.ts" />

import assert from 'assert';
import argsParser from 'yargs-parser';
import { describe, test, beforeEach } from 'mocha';

import { parseArgs } from '../../src/cli';


const ARGS = <argsParser.Arguments> {};
const PARAMS = <{
    file?: string | string[],
    source?: string,
    glob?: string | string[],
    outFile?: string,
    outDir?: string,
    transformer?: string,
}> {};


describe( 'cli', () => {

    describe( 'parseArgs()', () => {

        beforeEach(() => {
            Object.keys(ARGS).forEach(key => delete ARGS[key]);
            Object.keys(PARAMS).forEach(key => delete PARAMS[key]);

            PARAMS.file = undefined;
            PARAMS.source = undefined;
            PARAMS.glob = undefined;
            PARAMS.outFile = undefined;
            PARAMS.outDir = undefined;
            PARAMS.transformer = undefined;
        });


        describe( 'correct usage', () => {

            test( 'no args', () => {
                const args = parseArgs( ARGS );

                assert.deepEqual( args, {} );
            });

            test( 'no command', () => {
                ARGS._ = [];
                const args = parseArgs( ARGS );

                assert.deepEqual( args, {} );
            });

            test( 'valid command', () => {
                ARGS._ = [ 'info' ];
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { commandName: 'info', params: PARAMS }
                );
            });

            test( 'valid command with valid params', () => {
                ARGS._ = [ 'info' ];
                ARGS.file = 'foo';
                PARAMS.file = 'foo';
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { commandName: 'info', params: PARAMS }
                );
            });

            test( 'no command with valid params', () => {
                ARGS.file = 'foo';
                PARAMS.file = 'foo';
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { commandName: 'build', params: PARAMS }
                );
            });

            test( '--version', () => {
                ARGS._ = [];
                ARGS.version = true;
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { version: true }
                );
            });

            test( '--config', () => {
                ARGS._ = [];
                ARGS.config = 'foo';
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { config: 'foo' }
                );
            });

            test( 'info command', () => {
                ARGS._ = [ 'info' ];
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { commandName: 'info', params: PARAMS }
                );
            });

            test( 'compile command', () => {
                ARGS._ = [ 'compile' ];
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { commandName: 'compile', params: PARAMS }
                );
            });

            test( 'build command', () => {
                ARGS._ = [ 'build' ];
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { commandName: 'build', params: PARAMS }
                );
            });

            test( 'migrate command', () => {
                ARGS._ = [ 'migrate' ];
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { commandName: 'migrate', params: PARAMS }
                );
            });

        });


        describe( 'incorrect usage', () => {

            test( 'empty command', () => {
                ARGS._ = [ '' ];
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { error: Error('Command name is empty.') }
                );
            });

            test( 'more than one command', () => {
                ARGS._ = [ 'foo', 'bar' ];
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { error: Error('More than one command passed.') }
                );
            });

            test( 'invalid command', () => {
                ARGS._ = [ 'foo' ];
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { error: Error('Command not found: foo.') }
                );
            });

            test( 'valid command with invalid params', () => {
                ARGS._ = [ 'info' ];
                ARGS.foo = 'bar';
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { error: Error('Unknown parameters passed.') }
                );
            });

            test( 'no command with invalid params', () => {
                ARGS.foo = 'bar';
                const args = parseArgs( ARGS );

                assert.deepEqual(
                    args,
                    { error: Error('Unknown parameters passed.') }
                );
            });

        });

    });

});
