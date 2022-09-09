import _ from 'lodash';

import {
    exit,
    logger,
    objectType
} from '../utils';

import { sassBuild, sassBuildFiles } from '../build';

export function stageBuild(buildSection: BuildStageEntry[], defaults: CliBuildOptions) {

    if (buildSection === undefined) {
        logger.silly('config > build', 'No build stage.');
        return;
    }

    if (Array.isArray(buildSection) === false) {
        exit( 9, 'error', 'config > build', `Expected config.build to be array, but got ${objectType(buildSection)}.\n`);
    }

    if (buildSection.length === 0) {
        logger.silly('config > build', 'Build stage is empty.');
        return;
    }

    buildSection.forEach(buildEntry => {

        if (typeof buildEntry === 'string') {
            sassBuildFiles( [ buildEntry ] );
            return;
        }

        const options = <CliBuildOptions> {
            cwd: buildEntry.cwd,
            compiler: buildEntry.compiler,
            api: buildEntry.api,
            postcss: buildEntry.postcss,
            sassOptions: buildEntry.sassOptions
        };
        const opts = <CliBuildOptions> _.defaultsDeep( {}, options, defaults );

        const { file, outFile } = <ConfigStageFileEntry> buildEntry;

        if (typeof file === 'string') {

            if (typeof outFile !== 'string' ) {
                exit( 9, 'error', 'config > build', `Expected outFile to be string, but got ${objectType(outFile)}.\n`);
            }

            sassBuild( file, outFile, opts );
            return;
        }

        const { entry, output } = <ConfigStageGlobEntry> buildEntry;

        if ( typeof entry === 'string' ) {
            sassBuildFiles( [ entry ], output, opts );
            return;
        }

        if (Array.isArray(entry)) {
            sassBuildFiles( entry, output, opts );
            return;
        }

        exit( 9, 'error', 'config > build', `Expected file and outFile or entry fields.\n`);
    });
}
