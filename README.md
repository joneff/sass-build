# sass-build

[sass-build] is an attempt to simplify the mundane task fo compiling sass. For what is worth, front-end developers probably don't need this package, yet all developers might find it useful due to it's simplicity and configuration.

## Misc

sass-build was originally intended as a CLI tool, but since its guts are js (typescript to be precise), it can be used in js as well.

sass-build differs between compiling a file, which only returns the content and building a file, which will actually output it to disk.

sass-build works with an abstract set of sass options that are mapped to actual sass options, depending on the compiler and api used.

## Installation

You can install sass-build using the following command:

```shell
npm install sass-build [--save-dev]
```

## CLI Usage

By executing sass-build with no args, it will look for a file named [`sass.config.js`][sass-config] and process it.

```shell
sass-build
```

To specify a different config use `-c`:

```shell
sass-build -c path/to/config.js
```

To compile a file, use `-f`:

```shell
sass-build -f path/to/file.scss
```

To build a file, supply the `-d` arg:

```shell
sass-build -f path/to/file.scss -d path/to/dest.css
```

To build multiple files, based on glob pattern, use `-g`:

```shell
sass-build -g "**/*.scss"
```

The default output location is `./dist`. To change it, supply the `-o` arg:

```shell
sass-build -g "**/*.scss" -o "/path/to/output/dir"
```

To migrate a [WebCompiler] config to a sassBuild compatible one use:

```shell
# migrate compilerconfig.json to sass.config.js
sass-build --migrate-compiler-config

# specify which config to which output
sass-build --migrate-compiler-config -c "path/to/config.json" -d "path/to/config.js"
```

## API Usage

```js
const { sassBuild, sassBuildFiles } = require('sass-build');

let file = '/path/to/file.scss';
let outFile = '/path/to/outFile.css';

const output = {
    path: './my_dist', // specify output dir; defaults to './dist'
    filename: '[name:toLower].css' // specify output file name; defaults to '[name].css'
};
const options = {
    implementation: 'sass-embedded', // defaults to 'node-sass',
    api: 'modern', // defaults to 'legacy'
    sassOptions: {
        minify: true // defaults to false
    }
};

// single file
sassBuild(file, outFile); // compiles file and writes the result in outFile
sassBuild(file, outFile, options); // the same but with options

// Multiple files
sassBuildFiles('**/*.scss'); // compile all matched files to /dist
sassBuildFiles('**/*.scss', output ); // the same but with output options
sassBuildFiles('**/*.scss', output, options ); // the same but with options
```

## Sass Config

Config files are the preferred way of working with sass build. Here is a sample one:

```js
module.exports = {
    extends: [
        // use a predefined config:
        // * ~ import enabled
        // * postcss with autoprefixer and postcss-calc
        // * caching
        'sass-build:recommended'
    ],
    files: [
        {
            // use packages/default as the folder in which all lookup is based. default is the process.cwd()
            cwd: 'packages/default',
            // path to source file, relative to cwd
            file: 'scss/all.scss',
            // path to out file, relative to cwd
            outFile: 'dist/all.css'
        },
        {
            cwd: 'packages/fluent',
            file: 'scss/all.scss',
            outFile: 'dist/all.css',
            // use different sass implementation
            implementation: 'sass-embedded',
            // use @use instead of @import syntax
            api: 'modern'
        }
    ]
};
```


## Contributing?

Sure.

[sass-build]: https://github.com/joneff/sass-build
[sass-config]: #sass-config
[WebCompiler]: https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebCompiler
