import { window, TextLine, Range } from 'vscode';

export class ImportSorter {

    public sortImportLineCommand(): void {
        return this.sortImportLine();
    }

    public sortImportLinesOnWordGroupingCommand(): void {
        return this.handleSelection(false);
    }

    public sortImportLinesOnMaxCharWidthCommand(): void {
        return this.handleSelection(true);
    }

    private handleSelection(checkForWidth: boolean) {
        if (!window.activeTextEditor) {
            return;
        }

        const editor = window.activeTextEditor;
        const selection = editor.selection;
        const selectionEndLine = editor.document.lineAt(selection.end.line);

        const range = new Range(selection.start.line, 0, selection.end.line, selectionEndLine.range.end.character);
        const input = editor.document.getText(range);

        const result = this.sortImport(input, checkForWidth);

        editor.edit(builder => {
            builder.replace(range, result);
        });

        window.showInformationMessage(`${selection.end.line - selection.start.line + 1} number of lines got sorted.`);
    }

    private sortImport(inputSelection: any, checkForWidth = false): string {
        const regex = /\{[^.]*?\}/gm;

        function normalize(input: any) {
            const removedChars = input.replace(/(\r\n\t|\n|\r\t|\{|\})/gm,"");
            const splitGroup = removedChars.split(',').map((item: any) => item.trim());
            splitGroup.sort((a: string, b: string) => {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            })
            return splitGroup;
        }

        function formatOnWidth(arr: string[]) {
            const width = checkForWidth;
            const tabWidth = 4;
            let string = '{\n' + ' '.repeat(tabWidth);
            let latestLength = 0;
            for (let i=0; i < arr.length; i++) {
              if(i === arr.length - 1) {
                string += arr[i] + ' \n}';
              } else {
                string += arr[i] + ', ';
              }
              if (width) {
                if (string.length - latestLength > 100 && i !== arr.length - 1) {
                  string += '\n' + ' '.repeat(tabWidth);
                  latestLength = string.length;
                }
              } else {
                if ((i+1) % 4 === 0 && i !== arr.length - 1) {
                  string += '\n' + ' '.repeat(tabWidth);
                }
              }
          
            }
            return string;
        }

        function sortOnSize(arr: string[]) {
            if (arr.length > 7) {
                return formatOnWidth(arr);
            } else {
                return `{ ${arr.join(', ')} }`;
            }
        }
          
        const returnObject = inputSelection.replace(regex, function(x: any) {
            const normalizedGroup = normalize(x);
            const formattedGroup = sortOnSize(normalizedGroup);
            return formattedGroup;
        });

        return returnObject;
    }

    private sortImportLine(): void {
        if (!window.activeTextEditor) {
            return;
        }

        const editor = window.activeTextEditor;
        const selection = editor.selection;

        // check if more than one line is selected
        if (selection.start.line !== selection.end.line) {
            window.showErrorMessage(`More than one line was selected`);
            return;
        }

        // just to test functionality out
        const lineToSort = editor.document.lineAt(selection.start.line);

        // check if line contains import
        const isImport = lineToSort.text.includes('import');
        if (!isImport) {
            window.showErrorMessage(`Selected line does not seem to have an import statement`);
            return;
        }

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
        const groupToSort = firstCapturingGroup.split(',').map(item => item.trim());

        // avoid mutating
        const sortedGroup = groupToSort.slice(0);
        sortedGroup.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });

        // add curly brackets
        const sortedLine = `{ ${sortedGroup.join(', ')} }`;

        return inputLine.replace(regex, sortedLine);
    }


    public dispose() {

    }
}