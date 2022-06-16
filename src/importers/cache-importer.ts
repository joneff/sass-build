import path from 'path';

const EMPTY_IMPORT = {};

export function sassCacheImporter(options: CacheImporterOptions = { cache: true }) : SassImporter {

    const cache = options.cache;
    const imported : Set<string> = cache instanceof Set
        ? cache
        : new Set();

    function sassCacheImporter(url: string, prev: string) : null | LegacyImporterResult {

        if (prev === 'stdin') {
            return null;
        }

        if (url.startsWith('~')) {
            imported.add(url);
            return null;
        }

        const file = path.resolve(path.join(
            path.dirname(prev),
            url
        ));

        if (cache && imported.has(file)) {
            return <LegacyImporterResult>EMPTY_IMPORT;
        }

        imported.add(file);

        return { file };
    }
    sassCacheImporter.name = 'sassCacheImporter';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sassCacheImporter.before = function( context: { cwd: string } ) : void {
        imported.clear();
    };


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sassCacheImporter.findFileUrl = function( url: string ) : URL | null {
        return null;
    };

    return <SassImporter>sassCacheImporter;
}
