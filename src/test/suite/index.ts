import path from 'path';
import Mocha from 'mocha';
import glob from 'glob';
import vscode from 'vscode';

export function run(): Promise<void> {
    const outputChan = vscode.window.createOutputChannel("Test Suite");
    // Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd'
	});

    const testsRoot = path.resolve(__dirname, '..');

    return new Promise((c, e) => {
        glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
            if(err) {
                return e(err);
            }

            files.forEach(f => {
                const testFilePath = path.resolve(testsRoot, f);
                outputChan.appendLine(`Adding test file: ${testFilePath}`);
                mocha.addFile(testFilePath);
            });

            try {
                mocha.run(failures => {
                    if(failures > 0) {
                        e(new Error(`${failures} tests failed.`));
                    } else {
                        c();
                    }
                });
            } catch (err) {
                console.error(err);
                e(err);
            }
        });
    });
}