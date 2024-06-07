import { EditorProviderProps } from "./types"
import { useEditor } from "./useEditor"
import { EditorContext } from "./editorContext"
import { useLayoutEffect } from "react"
import { useKeys } from "./keyStore"

export function EditorProvider({ children, ...initProps }: EditorProviderProps) {
	const { store, editorModule } = useEditor(initProps)

	useLayoutEffect(() => {
		store.getState().selectEntity(5)
	}, [])
	return <EditorContext.Provider value={{ store, editorModule }}>{children}</EditorContext.Provider>
}
