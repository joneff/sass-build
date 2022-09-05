import {
    exit,
    logger,
    requireUserFile,
    fileExists,
    writeFile
} from './utils';

type CompilerConfigFileEntry = {
    inputFile: string;
    outputFile: string;
    minify: {
        enabled: boolean
    };
    includeInProject: boolean;
    options: {
        sourceMap: boolean
    }
}

export function migrateCompilerConfig(src : string, dest : string) {

    if (!fileExists(src)) {
        exit(2, 'error', 'migrate', `Cannot find file ${src}`);
    }

    logger.silly('migrate', 'Found %s.', src);
    logger.silly('migrate', '  Migrating...');

    const compilerConfigContent : CompilerConfigFileEntry[] = requireUserFile(src);
    let sassConfigContent : any = {
        extends: [
            'sass-build:recommended'
        ],
        files: []
    };

    compilerConfigContent.forEach(oldEntry => {
        const newEntry = {
            file: oldEntry.inputFile,
            outFile: oldEntry.outputFile,
            sassOptions: {
                minify: oldEntry.minify?.enabled,
                sourceMap: oldEntry.options?.sourceMap
            }
        };
        sassConfigContent.files.push(newEntry);
    });

    sassConfigContent = `module.exports = ${JSON.stringify(sassConfigContent, null, 4 )};`;
    sassConfigContent = sassConfigContent.replace(/((?: {4})+)("[\w]+":)/gim, function(match, space, word) {
        return space + word.replaceAll('"', '');
    });

    writeFile( dest, sassConfigContent );

    logger.info('migrate', 'Successfully migrated %s to %s', src, dest );

}
