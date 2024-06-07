import { useEffect, useState } from "react"
import { useEditorStore } from "./useEditorStore"
import { EntityUpdateKind } from "./types"
import { useEditorControls } from "./useEditorControls"

export function useEntityChildren(entityId: number) {
	const store = useEditorStore()
	const { getEntityChildren } = useEditorControls()

	const subscribeToEntityUpdate = store.use.subscribeToEntityUpdate()

	const [children, setChildren] = useState<number[]>(() => getEntityChildren(entityId))

	function onChildrenChange() {
		setChildren(getEntityChildren(entityId))
	}

	useEffect(() => {
		const unsubscribe = subscribeToEntityUpdate(
			entityId,
			EntityUpdateKind.Children,
			onChildrenChange
		)

		return () => {
			unsubscribe()
		}
	}, [])

	return children
}
