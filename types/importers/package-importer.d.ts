declare type PackageImporterOptions = {
    cwd?: string | (() => string)
    nodeModules?: string | (() => string);
}
