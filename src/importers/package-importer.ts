import fs from 'fs';
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

        // If the file exists, don't process it
        if ( fs.existsSync( url ) ) {
            return null;
        }

        // Remove leading tilde, if any
        if ( url.startsWith('~') ) {
            // eslint-disable-next-line no-param-reassign
            url = url.slice(1);
        }

        const file = path.resolve(
            <string> cwd,
            <string> nodeModules,
            url
        );

        if ( fs.existsSync( file ) ) {
            return { file };
        }

        return null;
    }
    sassPackageImporter.name = 'sassPackageImporter';
    sassPackageImporter.before = function( context: { cwd: string } ) : void {
        cwd = context.cwd;
    };

    sassPackageImporter.findFileUrl = function( url: string ) : null | URL {

        // If the file exists, don't process it
        if ( fs.existsSync( url ) ) {
            return null;
        }

        // Remove leading tilde, if any
        if ( url.startsWith('~') ) {
            // eslint-disable-next-line no-param-reassign
            url = url.slice(1);
        }

        const file = path.resolve(
            <string> cwd,
            <string> nodeModules,
            url
        );

        if ( fs.existsSync( file ) ) {
            return pathToFileURL( file );
        }

        return null;
    };

    return <SassImporter> sassPackageImporter;
}
