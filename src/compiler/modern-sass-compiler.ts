import _ from 'lodash';

import { BaseSassCompiler } from './base-sass-compiler';

import {
    CWD,
    trimCwd,
    logger,
    toModernSassOptions
} from '../utils';

export class ModernSassCompiler extends BaseSassCompiler {

    compile( file: string, sassOptions?: SassOptions ) : string {
        const opts = toModernSassOptions( _.defaults( {}, sassOptions, this.options.sassOptions ) );

        logger.info(
            'compile',
            '%s => %s',
            trimCwd(CWD, file)
        );

        this.before();
        const result = (<ModernSassImplementation> this.implementation).compile( file, opts ).css;

        return <string> this.postcss.process(result).css;
    }

    compileString(source: string, sassOptions?: SassOptions): string {
        const opts = toModernSassOptions( _.defaults( {}, sassOptions, this.options.sassOptions ) );

        logger.info(
            'compileString',
            '%s',
            'data'
        );

        this.before();
        const result = (<ModernSassImplementation> this.implementation).compileString( source, opts ).css;

        return <string> this.postcss.process(result).css;
    }
}
