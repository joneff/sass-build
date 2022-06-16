const calc = require('postcss-calc');
const autoprefixer = require('autoprefixer');
const cwd = process.cwd();
const { sassCacheImporter } = require('../dist/importers/cache-importer');
const { sassPackageImporter } = require('../dist/importers/package-importer');

/** @type {CliOptions} */
const config = {
    cwd: cwd,
    implementation: 'node-sass',
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
};

module.exports = config;
