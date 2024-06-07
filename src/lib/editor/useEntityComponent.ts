import { useCallback, useEffect, useRef, useState } from "react"
import { useEditorStore } from "./useEditorStore"
import { ComponentType, ComponentTypeToComponentStructure, ComponentActor } from "./types"
import { componentTypeToUpdateKind } from "./entityComponent"

export function useEntityComponent<T extends ComponentType>(
	entityId: number,
	type: T
): [
	ComponentTypeToComponentStructure<T>,
	(value: Partial<ComponentTypeToComponentStructure<T>>) => void
] {
	const store = useEditorStore()
	const subscribeToEntityUpdate = store.use.subscribeToEntityUpdate()
	const { getter, setter } = store.use.componentActors().get(type) as ComponentActor<T>

	const [component, setComponent] = useState<ComponentTypeToComponentStructure<T>>(() =>
		getter(entityId)
	)

	function onComponentChange() {
		setComponent(getter(entityId))
	}

	const set = useCallback(
		(value: Partial<ComponentTypeToComponentStructure<T>>) => {
			setter(entityId, value)
		},
		[entityId]
	)
	useEffect(() => {
		setComponent(getter(entityId))
		const unsubscribe = subscribeToEntityUpdate(
			entityId,
			componentTypeToUpdateKind.get(type)!,
			onComponentChange
		)
		return () => {
			unsubscribe()
		}
	}, [entityId])

	return [component, set]
}
