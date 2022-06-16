import path from 'path';
import _ from 'lodash';

import {
    exit,
    isString,
    isArray,
    objectType,
    requireUserFile
} from './utils';
import { sassBuild, sassBuildFiles } from './sass-build';

function extendConfig(source: ConfigOptions) : ConfigOptions {
    let baseConfigs = source.extends;

    if (source.extends === undefined) {
        return source;
    }

    if (isString(baseConfigs)) {
        baseConfigs = [ <string> baseConfigs ];
    }

    if (isArray(baseConfigs) === false) {
        return source;
    }

    (<string[]> baseConfigs).forEach(baseConfigName => {
        let configPath = '';
        let configData: CliOptions = <CliOptions>{};
        const [ provider, identifier ] = baseConfigName.split(':', 2);

        if (provider !== 'sass-build' && provider !== 'plugin') {
            return;
        }

        if (identifier === undefined || identifier === '') {
            return;
        }

        if (provider === 'plugin') {
            configPath = identifier;
        } else {
            configPath = path.resolve(__dirname, '../lib', `sass-build-${identifier}.js`);
        }

        if (configPath !== '') {
            configData = require(configPath);
        }

        configData = _.pick(configData, 'cwd', 'implementation', 'api', 'postcss', 'sassOptions');

        // eslint-disable-next-line no-param-reassign
        source = _.defaultsDeep({}, source, configData);
    });

    return source;
}


export function buildConfig( configPath: string ) {

    let configData : ConfigOptions = requireUserFile( configPath );
    configData = extendConfig( configData );
    const rootFiles = configData.files;
    const rootOpts = _.pick(<CliOptions>configData, 'cwd', 'implementation', 'api', 'postcss', 'sassOptions');

    if (Array.isArray(rootFiles) === false) {
        exit( 9, 'error', 'buildConfig', `Expected config.files to be array, but got ${objectType(rootFiles)}\n`);
    }

    rootFiles.forEach(entry => {

        if (typeof entry === 'string') {
            sassBuildFiles( [ entry ] );
            return;
        }

        const options = _.pick(<CliOptions>entry, 'cwd', 'implementation', 'api', 'postcss', 'sassOptions' );
        const opts = _.defaultsDeep({}, options, rootOpts );

        const { file, outFile } = <Partial<ConfigSingleFileEntry>>entry;

        if (typeof file === 'string') {

            if (outFile === null || outFile === undefined) {
                exit( 9, 'error', 'buildConfig', `Expected config.entry.outFile to be array, but got ${rootFiles}\n`);
            }

            sassBuild( file, outFile, opts );
            return;
        }

        const { files, output } = <Partial<ConfigMultipleFilesEntry>>entry;

        if ( typeof files === 'string' ) {
            sassBuildFiles( [ files ], output, opts );
            return;
        }

        if (Array.isArray(files)) {
            sassBuildFiles( files, output, opts );
            return;
        }
    });
}
