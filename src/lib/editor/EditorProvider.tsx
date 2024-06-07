import { EditorProviderProps } from "./types"
import { useEditor } from "./useEditor"
import { EditorContext } from "./editorContext"
import { useLayoutEffect } from "react"

export function EditorProvider({ children, ...initProps }: EditorProviderProps) {
	 const { store, editorModule } = useEditor(initProps)

	return <EditorContext.Provider value={{ store, editorModule }}>{children}</EditorContext.Provider>
}