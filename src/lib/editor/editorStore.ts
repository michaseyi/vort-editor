import { EditorMode } from "./types"
import { create } from "zustand"
import { Signal } from "./signal"
import { EditorState, EditorActions, EntityUpdateListener, GlobalUpdateListener } from "./types"
import { createSelectors } from "./createSelectors"

export function createEditorStore(initProps: Partial<EditorState>) {
	const DEFAULT_EDITOR_STATE: EditorState = {
		initializationStage: "starting engine",
		isMultisampled: false,
		engineError: null,
		onInitSignal: new Signal(),
		onInFlightOperationFinishedSignal: new Signal(false),
		interactionMode: EditorMode.ObjectMode,
		entityUpdateListeners: new Set(),
		globalUpdateListeners: new Set(),
		componentActors: new Map(),
		selectedEntities: new Set(),
		lastSelectedEntity: null,
	}

	const store = create<EditorState & EditorActions>()((set) => ({
		...DEFAULT_EDITOR_STATE,
		...initProps,
		createRenderOutput: () => {},
		deleteRenderOutput: () => {},
		setInitializationStage: (stage) => set({ initializationStage: stage }),
		setEngineError: (cause) => set({ engineError: new Error(cause) }),
		clearEngineError: () => set({ engineError: null }),
		subscribeToEntityUpdate: (entityId, kind, callback) => {
			const entry: EntityUpdateListener = { entityId, kind, callback }
			set((state) => ({ entityUpdateListeners: new Set(state.entityUpdateListeners).add(entry) }))

			return () => {
				set((state) => {
					state.entityUpdateListeners.delete(entry)
					return { entityUpdateListeners: new Set(state.entityUpdateListeners) }
				})
			}
		},
		dispatchEntityUpdate: (entityId, kind) => {
			const state = store.getState()

			Array.from(state.entityUpdateListeners.entries()).forEach(([_, listener]) => {
				if (listener.entityId === entityId && listener.kind === kind) {
					listener.callback()
				}
			})
		},
		subscribeToGlobalUpdate: (kind, callback, extraData) => {
			const entry: GlobalUpdateListener = { kind, callback, extraData }
			set((state) => ({ globalUpdateListeners: new Set(state.globalUpdateListeners).add(entry) }))

			return () => {
				set((state) => {
					state.globalUpdateListeners.delete(entry)
					return { globalUpdateListeners: new Set(state.globalUpdateListeners) }
				})
			}
		},
		dispatchGlobalUpdate: (kind, data) => {
			const state = store.getState()

			Array.from(state.globalUpdateListeners.entries()).forEach(([_, listener]) => {
				if (data && listener.extraData !== data) {
					return
				}

				if (listener.kind === kind) {
					listener.callback()
				}
			})
		},
		selectEntity: (entityId) => {
			set((state) => ({
				lastSelectedEntity: entityId,
				selectedEntities: new Set(state.selectedEntities).add(entityId),
			}))
		},

		unselectEntity: (entityId) => {
			set((state) => {
				const selectedEntities = new Set(state.selectedEntities)
				selectedEntities.delete(entityId)
				return { selectedEntities }
			})
		},
		clearSelection: () => {
			set({ selectedEntities: new Set(), lastSelectedEntity: null })
		},
	}))

	return createSelectors(store)
}
