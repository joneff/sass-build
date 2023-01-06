declare type ConfigOptions = {
    extends: string | string[];
    defaults: {
        transform: CliTransformOptions;
        build: CliBuildOptions;
        bundle: CliBundleOptions;
    }
    files: BuildStageEntry[];
    transform: TransformStageEntry[];
    build: BuildStageEntry[];
    bundle: BundleStageEntry[];
}

declare type ConfigStageFileEntry = {
    file: string;
    outFile: string;
}
declare type ConfigStageGlobEntry = {
    entry: string;
    output: OutputOptions;
}
declare type ConfigStageEntry = ConfigStageFileEntry | ConfigStageGlobEntry;

declare type TransformStageEntry = ConfigStageEntry & CliTransformOptions;

declare type BuildStageEntry = ConfigStageEntry & CliBuildOptions;

declare type BundleStageEntry = ConfigStageEntry & CliBundleOptions;
