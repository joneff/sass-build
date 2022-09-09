import _ from 'lodash';

import { BaseSassCompiler } from './base-sass-compiler';

import {
    CWD,
    trimCwd,
    logger,
    toLegacySassOptions
} from '../utils';

export class LegacySassCompiler extends BaseSassCompiler {

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
        const result = (<LegacySassImplementation> this.compiler).renderSync(opts).css.toString('utf-8');

        return <string> this.postcss.process(result).css;
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
        const result = (<LegacySassImplementation> this.compiler).renderSync(opts).css.toString('utf-8');

        return <string> this.postcss.process(result).css;
    }
}
