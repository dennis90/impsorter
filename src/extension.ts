'use strict';
import { commands, ExtensionContext } from 'vscode';

import { ImportSorter } from './import-sorter';

export function activate(context: ExtensionContext) {

    const importSorter = new ImportSorter();

    const sortImportLine = commands.registerCommand('extension.sortImportLine', () => {
        importSorter.sortImportLineCommand();
    });
    const sortImportLinesOnWordGrouping = commands.registerCommand('extension.sortImportLinesOnWordGrouping', () => {
        importSorter.sortImportLinesOnWordGroupingCommand();
    });
    const sortImportLinesOnMaxCharWidth = commands.registerCommand('extension.sortImportLinesOnMaxCharWidth', () => {
        importSorter.sortImportLinesOnMaxCharWidthCommand();
    });

    context.subscriptions.push(importSorter);
    context.subscriptions.push(sortImportLine);
    context.subscriptions.push(sortImportLinesOnWordGrouping);
    context.subscriptions.push(sortImportLinesOnMaxCharWidth);
}

// this method is called when extension is deactivated
export function deactivate() {
}