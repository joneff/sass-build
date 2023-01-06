import _ from 'lodash';

import {
    CWD,
    getSassCompiler,
    getPostcss
} from '../utils';

import { ModernSassCompiler } from './modern-sass-compiler';
import { LegacySassCompiler } from './legacy-sass-compiler';


export function wrapCompiler( options?: SassCompilerOptions ) : SassCompiler {
    const defaults = <Partial<SassCompilerOptions>> {
        cwd: CWD
    };
    const opts = <SassCompilerOptions> _.defaultsDeep( {}, options, defaults );

    opts.compiler = getSassCompiler( opts.compiler );
    opts.postcss = getPostcss( opts.postcss );

    const info = opts.compiler.info.split('\t')[0];

    if (opts.api === 'modern') {
        if (info === 'node-sass') {
            throw new Error('Modern API is not supported for "node-sass"');
        }
        return new ModernSassCompiler( opts );
    }

    return new LegacySassCompiler( opts );
}
