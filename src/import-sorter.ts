import { Range, Selection, TextEditor, TextLine, window } from 'vscode';

enum SortConfig {
    SingleLine,
    MultiLine
};

export class ImportSorter {

    public sortImportLine(): void {
        const activeEditor = this.checkEditorAndSelection(
            window.activeTextEditor, (error: string) => {
                window.showErrorMessage(error);
                return;
            }
        );

        if (activeEditor === undefined) { return; }

        const [editor, selection] = activeEditor;

        if (isMultiline(selection)) {
            window.showErrorMessage(`More than one line was selected`);
            return;
        }

        const lineToSort = editor.document.lineAt(selection.start.line);

        if (!isImportStatement(lineToSort)) {
            window.showErrorMessage(`Selected line does not seem to have an import statement`);
            return;
        }

        const sortedLine = sortImportSelection(lineToSort.text, SortConfig.SingleLine);
        editor.edit(builder => builder.replace(lineToSort.range, sortedLine));
        window.showInformationMessage(`Line: ${selection.start.line + 1} got sorted.`);
    }


    public sortImportLinesOnWordGroupingCommand(): void {
        const activeEditor = this.checkEditorAndSelection(
            window.activeTextEditor, (error: string) => {
                window.showErrorMessage(error);
                return;
            }
        );

        if (activeEditor !== undefined) {
            const [editor, selection] = activeEditor;
            const selectionEndLine = editor.document.lineAt(selection.end.line);

            const range = new Range(selection.start.line, 0, selection.end.line, selectionEndLine.range.end.character);
            const input = editor.document.getText(range);

            const sortedImport = sortImportSelection(input, SortConfig.MultiLine);
            editor.edit(builder => builder.replace(range, sortedImport));
            window.showInformationMessage(`${selection.end.line - selection.start.line + 1} number of lines got sorted.`);
        }
    }


    public sortImportLinesOnMaxCharWidthCommand(): void {
        const activeEditor = this.checkEditorAndSelection(
            window.activeTextEditor, (error: string) => {
                window.showErrorMessage(error);
                return;
            }
        );

        if (activeEditor !== undefined) {
            const [editor, selection] = activeEditor;
            const selectionEndLine = editor.document.lineAt(selection.end.line);

            const range = new Range(selection.start.line, 0, selection.end.line, selectionEndLine.range.end.character);
            const input = editor.document.getText(range);

            const sortedImport = sortImportSelection(input, SortConfig.MultiLine);
            editor.edit(builder => builder.replace(range, sortedImport));
            window.showInformationMessage(`${selection.end.line - selection.start.line + 1} number of lines got sorted.`);
        }
    }


    // Make sure editor is active and that there is a selection.
    private checkEditorAndSelection(editor: TextEditor | undefined, cb: (err: string) => void): [TextEditor, Selection] | void {
        if (editor === undefined) { return cb(`Editor is not active`); }
        if (editor.selection === undefined) { return cb(`No valid selection`); }
        return [ editor, editor.selection ];
    }

}


// ---------- HELP FUNCTIONS ------------------------------------------
function isMultiline(selection: Selection): boolean {
    return selection.start.line !== selection.end.line;
}

function isImportStatement(selection: TextLine): boolean {
    return selection.text.includes('import');
}

function sortImportSelection(selection: string, format: SortConfig): string {
    return selection.replace(/\{[^.]*?\}/gm, exp => {
        const normalized = exp.replace(/\s/g, "");
        const match = RegExp(/\{(.*?)\}/,'g').exec(normalized);
        if (match === null || match[1] === undefined) {
            return exp;
        }
        const arrayToSort = match[1].split(',');
        const sortedArray = sortArray(arrayToSort);
        return formatArray(sortedArray, format);
    });
}

function sortArray(arr: string[]): string[] {
    return arr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

function formatArray(arr: string[], format: SortConfig): string {
    let formattedArray;
    switch (format) {
        case SortConfig.SingleLine: {
            formattedArray = arr.map((entry, index) => {
                if (index !== 0) {
                    entry = ' ' + entry;
                }
                return entry;
            });
            return `{ ${formattedArray} }`;
        }

        case SortConfig.MultiLine: {
            formattedArray = arr.map((entry, index) => {
                entry = '\n    ' + entry;
                return entry;
            });
            return `{${formattedArray}\n}`;
        }
    
        default: {
            return arr.toString();
        }
    }
}
