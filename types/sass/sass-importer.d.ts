declare type ModernImporterResult = {
    contents: string;
    sourceMapUrl?: URL;
    syntax?: 'css' | 'scss' | 'indented';
};

declare type LegacyImporterResult = { file: string } | { contents: string } | null;

declare type SassImporter = {
    (url: string) : LegacyImporterResult;
    name?: string;
    findFileUrl( url: string ) : null | URL;
    canonicalize?( url: string ) : null | URL;
    load?( canonicalUrl: URL ) : null | ModernImporterResult;
    before?(): void;
    after?(): void;
}
