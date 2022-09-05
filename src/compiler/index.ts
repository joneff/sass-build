import _ from 'lodash';

import {
    CWD,
    getSassCompiler,
    getPostcss
} from '../utils';

import { ModernSassCompiler } from './modern-sass-compiler';
import { LegacySassCompiler } from './legacy-sass-compiler';


export function wrapImplementation( options?: CliOptions ) : SassCompiler {
    const defaults = <Partial<CliOptions>>{
        cwd: CWD
    };
    const opts = _.defaultsDeep( {}, options, defaults );

    opts.implementation = getSassCompiler( opts.implementation );
    opts.postcss = getPostcss( opts.postcss );

    const info = opts.implementation.info.split('\t')[0];

    if (opts.api === 'modern') {
        if (info === 'node-sass') {
            throw new Error('Modern API is not supported for "node-sass"');
        }
        return new ModernSassCompiler( opts );
    }

    return new LegacySassCompiler( opts );
}
