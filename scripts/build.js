#!/usr/bin/env node

const argsParser = require('yargs-parser');
const esbuild = require('esbuild');
const glob = require('glob');
const entryPoints = glob.sync('src/**/*.ts');

const argv = argsParser(process.argv.slice(2), {
    alias: {
        'w': 'watch'
    }
});
const watch = argv.watch;

if (watch) {
    esbuild.build({
        logLevel: 'info',
        entryPoints: entryPoints,
        outdir: './dist',
        platform: 'node',
        format: 'cjs',
        minify: false,
        sourcemap: false,
        watch: true
    });
} else {
    esbuild.buildSync({
        logLevel: 'info',
        entryPoints: entryPoints,
        outdir: './dist',
        platform: 'node',
        format: 'cjs',
        minify: false,
        sourcemap: false
    });
}
