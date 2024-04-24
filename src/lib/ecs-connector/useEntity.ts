import { useEffect, useState } from "react"
import { Component, useInstance, ECSEvent, Position, Velocity } from "./vort-ecs"

type TypeFromConstructor<T> = T extends { new (...args: any[]): infer U } ? U : never

type EntityComponentQuery = {
	[key: string]: {
		type: { new (...args: any[]): Component; get: (entityID: number) => Component }
	}
}
type EntityComponentQueryResult<T extends EntityComponentQuery> = {
	[K in keyof T]: TypeFromConstructor<T[K]["type"]>
}

type SetComponentValues<T extends EntityComponentQuery> = {
	[K in keyof T]?: Partial<TypeFromConstructor<T[K]["type"]>>
}

export function useEntityComponent<T extends EntityComponentQuery>(
	entityID: number,
	query: T
): EntityComponentQueryResult<T> & { set: (values: SetComponentValues<T>) => void } {
	const { addEventListener, removeEventListener } = useInstance()

	const [result, setResult] = useState<EntityComponentQueryResult<T>>(() => {
		let result: EntityComponentQueryResult<T> = {} as EntityComponentQueryResult<T>
		Object.entries(query).forEach(([key, component]) => {
			result[key as keyof T] = component.type.get(
				entityID
			) as EntityComponentQueryResult<T>[keyof T]
		})
		return result
	})

	useEffect(() => {
		function onEntityComponentChange({
			entityID: mutatedEntityID,
			componentName,
			componentValue,
		}: {
			entityID: number
			componentName: string
			componentValue: any
		}) {
			if (mutatedEntityID === entityID) {
				const mutatedComponent = Object.entries(query).find(
					([_, component]) => component.type.name === componentName
				)

				if (mutatedComponent) {
					const [key] = mutatedComponent
					setResult((prev) => {
						prev[key as keyof T] = Object.assign(prev[key], componentValue)
						return { ...prev }
					})
				}
			}
		}
		addEventListener(ECSEvent.ON_ENTITY_COMPONENT_CHANGE, onEntityComponentChange)

		return () => {
			removeEventListener(ECSEvent.ON_ENTITY_COMPONENT_CHANGE, onEntityComponentChange)
		}
	}, [])

	function set(values: SetComponentValues<T>) {
		Object.entries(values).forEach(([componentName, componentUpdateToApply]) => {
			const currentComponentValue = result[componentName]
			const componentClass = query[componentName].type

			console.log(currentComponentValue)
		})
	}

	return { ...result, set }
}
