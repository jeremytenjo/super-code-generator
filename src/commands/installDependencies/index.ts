import vscode from "vscode"
import { SuperCodeGeneratorSettingsSchema } from "../..";

export function installDependencies(context: vscode.ExtensionContext, verbose?: boolean) {
    if(verbose === undefined) {
        // load the user config
        const userConfig = context.workspaceState.get(`${context.extension.id}.extensionSettings`) as SuperCodeGeneratorSettingsSchema;
        verbose = userConfig.verbose
    }

    // we add this event listener so that we can run the command after the terminal is created
    const onTerminalOpenListener: vscode.Disposable = vscode.window.onDidOpenTerminal((_term) => {
        if(_term.name === 'Super Code Generator - Install Dependencies') {
            _term.sendText("npm ci --omit=dev;exit");
            if(verbose)
                vscode.window.showInformationMessage('Successfully installed dependencies');
            // dispose the event listener
            onTerminalOpenListener.dispose();
        }
    })

    const terminal = vscode.window.createTerminal({
        name: 'Super Code Generator - Install Dependencies',
        // hide the terminal from the user if the user has verbose disabled
        hideFromUser: !verbose,
        isTransient: true,
        cwd: context.extensionPath,
    })
    // don't take focus from the user
    terminal.show(true);
}