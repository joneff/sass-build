const calc = require('postcss-calc');
const autoprefixer = require('autoprefixer');
const cwd = process.cwd();
const { sassCacheImporter } = require('../dist/importers/cache-importer');
const { sassPackageImporter } = require('../dist/importers/package-importer');

/** @type {ConfigOptions} */
const config = {
    defaults: {
        transform: {
            cwd: cwd
        },
        build: {
            cwd: cwd,
            compiler: 'node-sass',
            api: 'legacy',
            sassOptions: {
                minify: false,
                functions: [],
                importers: [
                    sassCacheImporter(),
                    sassPackageImporter({ cwd: cwd })
                ]
            },
            postcss: [
                calc({ precision: 10 }),
                autoprefixer()
            ]
        }
    }
};

module.exports = config;
