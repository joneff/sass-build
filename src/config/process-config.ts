import path from 'path';
import _ from 'lodash';

import {
    exit,
    logger,
    isString,
    isArray,
    fileExists,
    requireUserFile
} from '../utils';

import { stageBuild } from './stage-build';
import { stageTransform } from './stage-transform';

const stageMap = {
    build: stageBuild,
    transform: stageTransform
};

const defaultStages = [ 'transform', 'build' ];

function getDefaults(source: ConfigOptions) : ConfigOptions['defaults'] {
    let baseConfigs = source.extends;

    if (baseConfigs === undefined) {
        return source.defaults || <ConfigOptions['defaults']> {};
    }

    if (isString(baseConfigs)) {
        baseConfigs = [ baseConfigs ];
    }

    if (isArray(baseConfigs) === false) {
        return source.defaults || <ConfigOptions['defaults']> {};
    }

    baseConfigs.forEach(baseConfigName => {
        let configPath = '';
        let configData: ConfigOptions = <ConfigOptions>{};
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
            configPath = path.resolve(__dirname, '../../lib', `sass-build-${identifier}.js`);
        }

        if (configPath !== '') {
            configData = require(configPath);
        }

        source.defaults = _.defaultsDeep({}, source.defaults, configData.defaults);
    });

    return source.defaults;
}

export function processConfigFile( configPath: string, stages: string[] = defaultStages ) {

    if (configPath) {
        logger.silly('process config', `Using config: ${configPath}`);
    } else {
        logger.silly('process config', 'Using default config: sass.config.js');
        // eslint-disable-next-line no-param-reassign
        configPath = 'sass.config.js';
    }

    if (!fileExists(configPath)) {
        exit( 2, 'error', 'process config', `Cannot file config file: ${configPath}` );
    }

    const config : ConfigOptions = requireUserFile( configPath );

    processConfig(config, stages);
}

export function processConfig(config: ConfigOptions, stages: string[] = defaultStages) {
    const configDefaults = getDefaults( config );

    if (Array.isArray(config.files)) {
        if (Array.isArray(config.build)) {
            logger.warn('process config', `Found both config.build and config.files. Using config.build.`);
        } else {
            logger.warn('process config', `Prefer config.build instead of config.files.`);
            config.build = Array.from(config.files);
        }
        delete config.files;
    }

    stages.forEach(stage => {
        const stageFn = stageMap[stage];
        const stageData = config[stage];
        const stageDefaults = configDefaults[stage] || {};

        if (typeof stageFn === 'function') {
            stageFn( stageData, stageDefaults );
        }
    });

}
