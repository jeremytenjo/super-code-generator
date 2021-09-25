module.exports = function useRecentSelectedPaths(context) {
  // https://code.visualstudio.com/api/references/vscode-api#Memento
  let recentSelectedPaths = context.workspaceState.get('recentSelectedPaths') || []

  return {
    get() {
      return recentSelectedPaths
    },
    update(selectedFile) {
      context.workspaceState.update('recentSelectedPaths', [
        { ...selectedFile, detail: 'Recently Opened' },
      ])
    },
  }
}
