import { wrapImplementation } from './sass-compiler';

function sassCompile( file: string, options?: CliOptions ) : string {
    const compiler = wrapImplementation( options );

    return compiler.compile( file, options?.sassOptions );
}

function sassCompileString( source: string, options?: CliOptions ) : string {
    const compiler = wrapImplementation( options );

    return compiler.compileString( source, options?.sassOptions );
}

export {
    sassCompile,
    sassCompileString
};
