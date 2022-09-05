import fs from 'fs';

import {
    exit,
    fileExists
} from '../utils';

type CompilerConfigEntry = {
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

export function compilerConfigTransformer(pathToConfig: string) {
    if (!fileExists(pathToConfig)) {
        exit(2, 'error', 'migrate > transformer', `Cannot find file ${pathToConfig}`);
    }

    const compilerConfigJson : CompilerConfigEntry[] = JSON.parse(fs.readFileSync( pathToConfig, 'utf-8' ));

    let sassConfigContent : any = {
        extends: [
            'sass-build:recommended'
        ],
        files: []
    };

    compilerConfigJson.forEach(oldEntry => {
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

    return sassConfigContent;
}
