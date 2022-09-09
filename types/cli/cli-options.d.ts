declare type ApiType = 'modern' | 'legacy';

declare type CommonCliOptions = {
    cwd: string;
}


declare type CliBuildOptions = CommonCliOptions & {
    compiler: string | NativeSassCompiler;
    api: ApiType;
    postcss: false | 'auto' | [] | PostcssProcessor;
    sassOptions: SassOptions;
}
declare type CliBuilder = string | Function | {
    buildFile: Function;
    buildGlob: Function;
}


declare type CliBundleOptions = CommonCliOptions & {
    bundler: string | Function;
    bundlerOptions?: any;
}


declare type CliTransformOptions = CommonCliOptions & {
    transformer: CliTransformer;
    transformerOptions: {
        header: string | ((file: string, content: any)=> string);
        footer: string | ((file: string, content: any)=> string);
    };
}
declare type CliTransformer = (Object | ((...args) => void)) & {
    transformFile: TransformFileFn;
    transformGlob: TransformGlobFn;
};

declare type CliOptions = CliBuildOptions | CliTransformOptions;
