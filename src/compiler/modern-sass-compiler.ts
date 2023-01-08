import _ from 'lodash';

import { BaseSassCompiler } from './base-sass-compiler';

import {
    CWD,
    trimCwd,
    logger
} from '../utils';


// #region utils
export function toModernSassOptions(options: SassOptions) : ModernSassOptions {
    const result = <ModernSassOptions> {
        // shared options
        charset: false,
        precision: 10,
        indentType: 'space',
        indentWidth: 4,
        linefeed: 'lf',
        sourceMap: options.sourceMap,
        verbose: false,
        quietDeps: true,

        // modern specific
        loadPaths: options.loadPaths || [],
        style: options.minify ? 'compressed' : 'expanded',
        functions: options.functions,
        importers: options.importers
    };

    return result;
}
// #endregion


export class ModernSassCompiler extends BaseSassCompiler {
    public compiler: ModernSassImplementation;

    compile( file: string, sassOptions?: SassOptions ) : string {
        const opts = toModernSassOptions( _.defaults( {}, sassOptions, this.options.sassOptions ) );

        logger.info(
            'compile',
            '%s',
            trimCwd(CWD, file)
        );

        this.before();
        const result = this.compiler.compile( file, opts ).css;

        return this.postcss.process(result).css;
    }

    compileString(source: string, sassOptions?: SassOptions): string {
        const opts = toModernSassOptions( _.defaults( {}, sassOptions, this.options.sassOptions ) );

        logger.info(
            'compileString',
            '%s',
            'data'
        );

        this.before();
        const result = this.compiler.compileString( source, opts ).css;

        return this.postcss.process(result).css;
    }

}
