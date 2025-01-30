import type {ExtensionContext, QuickPickItem} from "vscode"

export default function useRecentSelectedPaths(context: ExtensionContext) {
  // https://code.visualstudio.com/api/references/vscode-api#Memento
  let recentSelectedPaths = context.workspaceState.get<QuickPickItem[]>('recentSelectedPaths') || []

  return {
    get(): QuickPickItem[] {
      return recentSelectedPaths
    },
    update(selectedFile: QuickPickItem): void {
      context.workspaceState.update('recentSelectedPaths', [
        { ...selectedFile, detail: 'Recently Opened' },
      ])
    },
  }
}
