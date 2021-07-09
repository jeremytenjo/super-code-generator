module.exports = function useRecentSelectedPaths(context) {
  let recentSelectedPaths =
    context.workspaceState.get('recentSelectedPaths') || []

  return {
    get() {
      return recentSelectedPaths
    },
    update(selectedFile) {
      context.workspaceState.update('recentSelectedPaths', [
        { ...selectedFile, detail: 'Recently Opened' }
      ])
    }
  }
}
