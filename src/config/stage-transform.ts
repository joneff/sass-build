import _ from 'lodash';

import {
    exit,
    logger,
    objectType
} from '../utils';

export function stageTransform(transformSection: TransformStageEntry[], defaults: CliTransformOptions) {

    if (transformSection === undefined) {
        logger.silly('config > transform', 'No transform stage.');
        return;
    }

    if (Array.isArray(transformSection) === false) {
        exit( 9, 'error', 'config > transform', `Expected config.transform to be array, but got ${objectType(transformSection)}.\n`);
    }

    if (transformSection.length === 0) {
        logger.silly('config > transform', 'Transform stage is empty.');
        return;
    }

    transformSection.forEach(transformEntry => {

        const options = <CliTransformOptions> {
            cwd: transformEntry.cwd,
            transformer: transformEntry.transformer,
            transformerOptions: transformEntry.transformerOptions
        };
        const opts = <CliTransformOptions> _.defaultsDeep( {}, options, defaults );

        const transformer = opts.transformer;
        let { transformFile, transformGlob } = transformer;

        if (!transformFile && !transformGlob) {
            transformFile = <TransformFileFn> transformer;
            transformGlob = <TransformGlobFn> transformer;
        }

        if (typeof transformFile !== 'function') {
            exit( 9, 'error', 'config > transform', `Expected transformFile to be function, but got ${objectType(transformFile)}.\n`);
        }

        if (typeof transformGlob !== 'function') {
            exit( 9, 'error', 'config > transform', `Expected transformGlob to be function, but got ${objectType(transformGlob)}.\n`);
        }

        const { file, outFile } = <ConfigStageFileEntry> transformEntry;

        if (typeof file === 'string') {

            if (typeof outFile !== 'string' ) {
                exit( 9, 'error', 'config > build', `Expected outFile to be string, but got ${objectType(outFile)}.\n`);
            }

            transformFile( file, outFile, opts );
            return;
        }

        const { entry, output } = <ConfigStageGlobEntry> transformEntry;

        if ( typeof entry === 'string' ) {
            transformGlob( [ entry ], output, opts );
            return;
        }

        if (Array.isArray(entry)) {
            transformGlob( entry, output, opts );
            return;
        }

        exit( 9, 'error', 'config > build', `Expected file and outFile or entry fields.\n`);
    });

}
