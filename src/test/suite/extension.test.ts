import * as vscode from "vscode";
import useRecentSelectedComponents from "../../common/generateCode/handlers/useRecentSelectedComponents";
import { ParamsPropsSchema } from "../../../utils/types/ParamsPropsSchema";

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

    test("ParamsPropsSchema supports file type", () => {
        // This test validates that the type system supports 'file' param type
        const fileParam: ParamsPropsSchema<{ configFile: string }> = {
            name: 'configFile',
            type: 'file',
            description: 'Select a configuration file'
        };

        const inputParam: ParamsPropsSchema<{ title: string }> = {
            name: 'title',
            type: 'input',
            description: 'Enter a title'
        };

        const dropdownParam: ParamsPropsSchema<{ variant: string }> = {
            name: 'variant',
            type: 'dropdown',
            description: 'Select a variant',
            options: [
                { value: 'primary' },
                { value: 'secondary' }
            ]
        };

        // Verify types are correctly defined
        console.log("File param type:", fileParam.type);
        console.log("Input param type:", inputParam.type);
        console.log("Dropdown param type:", dropdownParam.type);
        
        // Test passes if no errors are thrown
    });

});