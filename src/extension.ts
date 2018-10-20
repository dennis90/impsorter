'use strict';
import { commands, ExtensionContext } from 'vscode';

import { ImportSorter } from './import-sorter';

export function activate(context: ExtensionContext) {

    const importSorter = new ImportSorter();

    // The command has been defined in the package.json file
    // The commandId parameter must match the command field in package.json
    const disposable = commands.registerCommand('extension.sortImportLine', () => {

        importSorter.sortActiveDocumentImportsCommand();

    });

    context.subscriptions.push(importSorter);
    context.subscriptions.push(disposable);
}

// this method is called when extension is deactivated
export function deactivate() {
}