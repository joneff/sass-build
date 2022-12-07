import fs from 'fs';
import path from 'path';

const EMPTY_IMPORT_RESULT = <LegacyImporterResult> {};

export function sassCacheImporter( options: CacheImporterOptions = { cache: true } ) : SassImporter {

    const cache = options.cache;
    const imported : Set<string> = cache instanceof Set
        ? cache
        : new Set();

    function sassCacheImporter( url: string, prev: string ) : LegacyImporterResult {

        // If previous file is stdin, then we are importing from a string
        if (prev === 'stdin') {
            return null;
        }

        const file = path.resolve(
            path.dirname(prev),
            url
        );

        // Only cache existing files
        if ( fs.existsSync( file ) ) {

            if ( cache && imported.has( file ) ) {
                return EMPTY_IMPORT_RESULT;
            }

            imported.add( file );

            return { file };
        }

        return null;
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

    return <SassImporter> sassCacheImporter;
}
