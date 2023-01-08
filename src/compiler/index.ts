import _ from 'lodash';

import {
    CWD,
    getPostcss,
    isString
} from '../utils';

import { ModernSassCompiler } from './modern-sass-compiler';
import { LegacySassCompiler } from './legacy-sass-compiler';


// #region utils
function getDefaultSassCompiler() : NativeSassCompiler {
    let sassPkg = 'node-sass';

    try {
        require.resolve('node-sass');
    } catch (ignoreError) {
        try {
            require.resolve('sass');
            sassPkg = 'sass';
        } catch (_ignoreError) {
            try {
                require.resolve('sass-embedded');
                sassPkg = 'sass-embedded';
            } catch (__ignoreError) {
                sassPkg = 'node-sass';
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return <NativeSassCompiler> require(sassPkg);
}

function getSassCompiler(compiler?: string | NativeSassCompiler) : NativeSassCompiler {
    let resolvedCompiler = <NativeSassCompiler> compiler;

    if (resolvedCompiler === undefined) {
        resolvedCompiler = getDefaultSassCompiler();
    }

    if (isString(resolvedCompiler)) {
        resolvedCompiler = require(resolvedCompiler);
    }

    const { info } = resolvedCompiler;

    if (info === undefined) {
        throw new Error('Unknown Sass implementation.');
    }

    const infoParts = info.split('\t');

    if (infoParts.length < 2) {
        throw new Error(`Unknown Sass implementation "${info}".`);
    }

    const implementationName = infoParts[0];

    switch (implementationName) {
        case 'dart-sass':
        case 'node-sass':
        case 'sass-embedded': {
            // eslint-disable-next-line consistent-return
            return resolvedCompiler;
        }
        default: {
            throw new Error(`Unknown Sass implementation "${implementationName}".`);
        }
    }
}
// #endregion


export function wrapCompiler( options?: SassCompilerOptions ) : SassCompiler {
    const defaults = <SassCompilerOptions> {
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
