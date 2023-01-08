import _ from 'lodash';

import { BaseSassCompiler } from './base-sass-compiler';

import {
    CWD,
    trimCwd,
    logger
} from '../utils';


// #region utils
export function toLegacySassOptions(options: SassOptions) : LegacySassOptions {
    const result = <LegacySassOptions> {
        // shared options
        charset: false,
        precision: 10,
        indentType: 'space',
        indentWidth: 4,
        linefeed: 'lf',
        sourceMap: options.sourceMap,
        verbose: false,
        quietDeps: true,

        // legacy specific
        file: options.file,
        outFile: options.outFile,
        data: options.source,
        includePaths: options.loadPaths || [],
        outputStyle: options.minify ? 'compressed' : 'expanded',
        functions: options.functions,
        importer: options.importers
    };

    return result;
}
// #endregion


export class LegacySassCompiler extends BaseSassCompiler {
    public compiler: LegacySassImplementation;

    compile(file: string, sassOptions?: SassOptions): string {
        const opts = toLegacySassOptions( _.defaults( {}, sassOptions, this.options.sassOptions ) );

        opts.file = file;
        delete opts.data;

        logger.info(
            'compile',
            '%s',
            trimCwd(CWD, file)
        );

        this.before();
        const result = this.compiler.renderSync(opts).css.toString('utf-8');

        return this.postcss.process(result).css;
    }

    compileString(source: string, sassOptions?: SassOptions): string {
        const opts = toLegacySassOptions( _.defaults( {}, sassOptions, this.options.sassOptions ) );
        opts.data = source;

        logger.info(
            'compile',
            '%s',
            'data'
        );

        this.before();
        const result = this.compiler.renderSync(opts).css.toString('utf-8');

        return this.postcss.process(result).css;
    }

}
