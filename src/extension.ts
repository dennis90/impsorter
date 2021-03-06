import { commands, ExtensionContext, workspace } from 'vscode';

import { ImportSorter } from './import-sorter';

export function activate(ctx: ExtensionContext) {
    const config = workspace.getConfiguration('impsorter');
    const importSorter = new ImportSorter(config);

    ctx.subscriptions.push(commands.registerCommand(
        'extension.sortImportLine',
        () => {
            importSorter.sortImportLine();
        }
    ));

    ctx.subscriptions.push(commands.registerCommand(
        'extension.sortImportsPerLine',
        () => {
            importSorter.sortImportsPerLine();
        }
    ));

    ctx.subscriptions.push(commands.registerCommand(
        'extension.sortImportLinesOnWordGrouping',
        () => {
            importSorter.sortImportLinesOnWordGroupingCommand();
        }
    ));

    ctx.subscriptions.push(commands.registerCommand(
        'extension.sortImportLinesOnMaxCharWidth',
        () => {
            importSorter.sortImportLinesOnMaxCharWidthCommand();
        }
    ));

}

// this method is called when extension is deactivated
export function deactivate() {
}