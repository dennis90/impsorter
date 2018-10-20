import { window, TextLine } from 'vscode';

export class ImportSorter {

    public sortActiveDocumentImportsCommand(): void {
        return this.sortImports();
    }

    public sortImports(): void {
        if (!window.activeTextEditor) {
            return;
        }

        const editor = window.activeTextEditor;
        const selection = editor.selection;

        // just to test functionality out
        const lineToSort = editor.document.lineAt(selection.start.line);

        const sortedLine = this.sortImportLineObject(lineToSort);
        editor.edit(builder => {
            builder.replace(lineToSort.range, sortedLine);
        });

        window.showInformationMessage(`Line: ${selection.start.line + 1} got sorted.`);
    }

    private sortImportLineObject(inputTextLine: TextLine) {

        // destruct from TextLine object
        const inputLine = inputTextLine.text;

        // find everything between curly brackets
        const regex = /\{(.*?)\}/g;

        // execute regexp to get matches
        const result = regex.exec(inputLine);

        // 1st capturing group excluding curly brackets
        const firstCapturingGroup = result ? result[1] : '';

        // string to array
        const groupToSort = firstCapturingGroup.split(',');

        // avoid mutating
        const sortedGroup = groupToSort.slice(0);
        sortedGroup.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });

        // add curly brackets
        const sortedLine = `{${sortedGroup.toString()}}`;

        return inputLine.replace(regex, sortedLine);
    }


    public dispose() {

    }
}