import * as vscode from "vscode";

suite("Extension Test Suite", () => {

    suiteTeardown(() => {
        vscode.window.showInformationMessage("All tests done!");
    })

    // TODO: Write tests

});