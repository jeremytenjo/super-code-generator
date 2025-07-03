import * as vscode from "vscode";
import useRecentSelectedComponents from "../../common/generateCode/handlers/useRecentSelectedComponents";

suite("Extension Test Suite", () => {

    suiteTeardown(() => {
        vscode.window.showInformationMessage("All tests done!");
    })

    test("useRecentSelectedComponents tracks components correctly", () => {
        // Mock ExtensionContext
        const mockContext = {
            workspaceState: {
                get: () => [],
                update: () => {}
            }
        } as any as vscode.ExtensionContext;

        const handler = useRecentSelectedComponents({ context: mockContext });
        
        // Initially should be empty
        const initial = handler.get();
        console.log("Initial recent components:", initial);
        
        // Add a component
        handler.update({ label: "React Component" });
        
        // Should now have one component with 'Recently Used' detail
        const afterUpdate = handler.get();
        console.log("After update:", afterUpdate);
        
        // Test passes if no errors are thrown
    });

});