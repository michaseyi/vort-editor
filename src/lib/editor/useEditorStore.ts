import { useContext } from "react"
import { EditorContext } from "./editorContext"

export function useEditorStore() {
	const editorContext = useContext(EditorContext)
	if (!editorContext) throw new Error("Missing EditorContex.Provider in the tree")
	return editorContext.store
}
