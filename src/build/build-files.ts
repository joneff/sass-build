import { wrapCompiler } from '../compiler';

export function sassBuildFiles( file: string | string[], output: OutputOptions = <OutputOptions>{}, options?: CliBuildOptions ) : void {
    const compiler = wrapCompiler( options );

    compiler.buildFiles( file, output, options?.sassOptions );
}
