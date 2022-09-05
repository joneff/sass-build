const compilerList = [
    'node-sass',
    'sass',
    'sass-embedded'
];

export function cliInfo() {
    const compilerInfo = getCompilerInfo(compilerList);

    if (compilerInfo.length > 0) {
        process.stdout.write('The following sass compilers are installed:\n');
        compilerInfo.forEach(info => {
            const [ main ] = info.split('\n');
            const [ compiler, version ] = main.split('\t');

            process.stdout.write(`- ${compiler}\t${version}\n`);
        });
    } else {
        process.stdout.write('No sass compilers found!\n');
    }
}

function getCompilerInfo(compilerList : string[]) {
    const compilerInfo: string[] = [];
    compilerList.forEach(name => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { info } = require(name);

            if (info) {
                compilerInfo.push( info );
            }
        } catch (e) {
            // no compiler with such name
        }
    });

    return compilerInfo;
}
