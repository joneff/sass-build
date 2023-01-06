import { exit } from "../../../utils";
import { validateParams } from "./validate-params";
import { migrate } from '../../../migrate';

type CliMigrateParams = {
    file: string;
    outFile: string;
    transformer: string;
}

export function cliMigrate( params ) {

    try {
        validateParams( params );
    } catch ( err ) {
        exit( 1, 'error', 'cli > migrate', err.message );
    }

    const { file, outFile, transformer } = <CliMigrateParams> params;

    migrate( file, outFile, transformer );
}
