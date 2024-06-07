import { useState } from "react"
import { EntityInfo } from "./types"
import { useEditorControls } from "./useEditorControls"

export function useEntityInfo(entityId: number): EntityInfo {
	const { getEntityName, getEntityInterface } = useEditorControls()

	const [entityName, setEntityName] = useState(() => getEntityName(entityId))
	const [entityInterface, setEntityInterface] = useState(() => getEntityInterface(entityId))

	return { entityName, entityInterface }
}
