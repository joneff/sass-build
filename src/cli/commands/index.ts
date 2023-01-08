import { cliBuild } from './build';
import { cliCompile } from './compile';
import { cliInfo } from './info';
import { cliMigrate } from './migrate';
import { cliTransform } from './transform';

const commandList = [
    'build',
    'compile',
    'info',
    'migrate',
    'transform'
];

export function get( commandName: string ): Function {

    if (typeof commandName !== 'string') {
        return null;
    }

    if (commandList.indexOf(commandName) === -1) {
        return null;
    }

    switch (commandName) {
        case 'build':
            return cliBuild;
        case 'compile':
            return cliCompile;
        case 'info':
            return cliInfo;
        case 'migrate':
            return cliMigrate;
        case 'transform':
            return cliTransform;
        default:
            return null;
    }
}

export function list(): string[] {
    return commandList;
}
