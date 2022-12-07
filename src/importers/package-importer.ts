import path from 'path';
import { pathToFileURL } from 'url';

export function sassPackageImporter( options?: PackageImporterOptions ) : SassImporter {

    let cwd = options?.cwd || process.cwd();
    let nodeModules = options?.nodeModules || 'node_modules';

    if (typeof cwd === 'function') {
        cwd = cwd();
    }

    if (typeof nodeModules === 'function') {
        nodeModules = nodeModules();
    }

    function sassPackageImporter( url: string ) : LegacyImporterResult {

        if ( !url.startsWith('~') ) {
            return null;
        }

        const file = path.resolve(
            <string>cwd,
            <string>nodeModules,
            url.slice(1)
        );

        return { file };
    }
    sassPackageImporter.name = 'sassPackageImporter';
    sassPackageImporter.before = function( context: { cwd: string } ) : void {
        cwd = context.cwd;
    };

    sassPackageImporter.findFileUrl = function( url: string ) : null | URL {

        if ( !url.startsWith('~') ) {
            return null;
        }

        const file = path.resolve(
            <string>cwd,
            <string>nodeModules,
            url.slice(1)
        );

        return pathToFileURL( file );
    };

    return <SassImporter>sassPackageImporter;
}
