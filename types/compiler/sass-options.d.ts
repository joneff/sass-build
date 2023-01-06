declare type SassOptions = {
    file: string;
    outFile: string;
    source: string;
    minify: boolean;
    logger: SassLogger;
    loadPaths: string[];
    functions: Record<string, ModernCustomFunction | LegacyCustomFunction>;
    importers: SassImporter[];
    sourceMap: boolean;
}

declare type SharedSassOptions = {
    charset: boolean;
    precision: 10;
    indentType: 'space';
    indentWidth: 4;
    linefeed: 'lf';
    sourceMap: boolean;
    logger: SassLogger;
    verbose: boolean;
    quietDeps: boolean;
}

declare type ModernSassOptions = SharedSassOptions & {
    loadPaths: [];
    style: 'expanded' | 'compressed';
    functions: Record<string, ModernCustomFunction>;
    importers: SassImporter[];
}

declare type LegacySassOptions = SharedSassOptions & {
    file: string;
    outFile: string;
    data: string;
    includePaths: [];
    outputStyle: 'expanded' | 'compressed';
    functions: Record<string, LegacyCustomFunction>;
    importer: SassImporter[];
}

declare type NativeSassOptions = ModernSassOptions | LegacySassOptions;
