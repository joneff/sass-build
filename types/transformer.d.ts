declare type TransformFileFn = ((
    file: string,
    outFile: string,
    options: CliTransformOptions
) => void);
declare type TransformGlobFn = ((
    fileOrGlob: string | string[],
    output: OutputOptions, options:
    CliTransformOptions
) => void);
