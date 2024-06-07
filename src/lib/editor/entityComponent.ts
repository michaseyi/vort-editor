import { ComponentType } from "./types"
import { EntityUpdateKind } from "./types"

export const componentTypeToUpdateKind: Map<ComponentType, EntityUpdateKind> = new Map([
	[ComponentType.Position, EntityUpdateKind.Position],
])
