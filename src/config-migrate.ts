import {
    requireUserFile,
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

export function migrateCompilerConfig(compilerConfigPath : string, sassConfigPath : string) {

    const compilerConfigContent : CompilerConfigFileEntry[] = requireUserFile(compilerConfigPath);
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

    writeFile( sassConfigPath, sassConfigContent );

}
