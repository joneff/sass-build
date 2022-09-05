import path from 'path';
import glob from 'glob';
import _ from 'lodash';

import {
    CWD,
    trimCwd,
    padCwd,
    isString,
    logger,
    writeFile,
    replacePathVariables
} from '../utils';

export abstract class BaseSassCompiler implements SassCompiler {
    protected implementation: SassImplementation;
    protected postcss: PostcssProcessor;
    protected options: CliOptions;

    constructor(options: CliOptions) {
        this.options = options;
        this.implementation = <SassImplementation> this.options.implementation;
        this.postcss = <PostcssProcessor> this.options.postcss;
    }

    abstract compile(file: string, sassOptions?: SassOptions) : string;
    abstract compileString(source: string, sassOptions?: SassOptions): string;

    before() {
        const importers = <any[]> this.options.sassOptions?.importers || [];

        importers.forEach(importer => {
            if ( _.isFunction(importer.before) ) {
                importer.before({ cwd: this.options.cwd });
            }
        });
    }

    build( file: string, outFile: string, sassOptions?: SassOptions) {
        // logger.time('build');
        const _cwd = this.options.cwd;

        if (path.isAbsolute(file) === false) {
            // eslint-disable-next-line no-param-reassign
            file = padCwd( _cwd, file );
        }

        if (path.isAbsolute(outFile) === false) {
            // eslint-disable-next-line no-param-reassign
            outFile = padCwd( _cwd, outFile );
        }
        logger.info(
            'build', '%s => %s',
            trimCwd(CWD, file),
            trimCwd(CWD, outFile)
        );
        logger.subdue('warn');
        const result = this.compile( file, sassOptions );

        writeFile( outFile, result );
        logger.awaken();

        // const duration = logger.timeEnd('build');
        // logger.info(
        //     'build', 'Done in %s.',
        //     duration
        // );
    }

    buildFiles(files: string | string[], output: OutputOptions, sassOptions?: SassOptions): void {
        const _cwd = this.options.cwd;

        if (isString(files)) {
            logger.warn( 'buildFiles', 'Prefer string[] for files option');
            // eslint-disable-next-line no-param-reassign
            files = [ files ];
        }

        // eslint-disable-next-line no-param-reassign
        output = _.defaults({}, output, { path: 'dist', filename: '[name].css' });

        if (path.isAbsolute(output.path) === false) {
            output.path = padCwd( _cwd, output.path );
        }

        files.forEach(fileOrGlob => {
            if (path.isAbsolute(fileOrGlob) === false) {
                // eslint-disable-next-line no-param-reassign
                fileOrGlob = padCwd( _cwd, fileOrGlob );
            }

            // eslint-disable-next-line no-param-reassign
            fileOrGlob = fileOrGlob.split(path.sep).join(path.posix.sep);

            glob.sync(fileOrGlob).forEach(file => {
                const outFile = path.resolve(
                    output.path,
                    replacePathVariables( output.filename, file )
                );

                this.build( file, outFile, sassOptions );
            });
        });
    }

    buildString( source: string, outFile: string, options?: SassOptions) {
        logger.info(
            'buildString',
            '%s => %s',
            'data',
            trimCwd(CWD, outFile)
        );
        logger.subdue('warn');
        const result = this.compileString( source, options );

        logger.awaken();
        writeFile( outFile, result );
    }

    get info(): string {
        return this.implementation.info;
    }
}
