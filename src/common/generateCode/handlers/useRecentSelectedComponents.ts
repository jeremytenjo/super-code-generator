import type {ExtensionContext, QuickPickItem} from "vscode"

export type UseRecentSelectedComponentsProps = {
  context: ExtensionContext
}

export default function useRecentSelectedComponents(props: UseRecentSelectedComponentsProps) {
  const { context } = props
  
  // https://code.visualstudio.com/api/references/vscode-api#Memento
  let recentSelectedComponents = context.workspaceState.get<QuickPickItem[]>('recentSelectedComponents') || []

  return {
    get(): QuickPickItem[] {
      return recentSelectedComponents
    },
    update(selectedComponent: QuickPickItem): void {
      // Remove the component if it already exists to avoid duplicates
      const filtered = recentSelectedComponents.filter(item => item.label !== selectedComponent.label)
      
      // Add the new component at the beginning and limit to 3 most recent
      const updated = [
        { ...selectedComponent, detail: 'Recently Used' },
        ...filtered
      ].slice(0, 3)
      
      context.workspaceState.update('recentSelectedComponents', updated)
      recentSelectedComponents = updated
    },
  }
}

export type UseRecentSelectedComponentsReturn = ReturnType<typeof useRecentSelectedComponents>