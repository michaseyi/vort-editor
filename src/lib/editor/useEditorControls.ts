import { useContext } from "react"
import { EditorContext } from "./editorContext"

export function useEditorControls() {
	const editorContext = useContext(EditorContext)
	if (!editorContext) throw new Error("Missing EditorContex.Provider in the tree")

	return editorContext.editorModule
}
