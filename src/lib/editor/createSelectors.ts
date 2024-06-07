import { StoreApi, UseBoundStore } from "zustand"
import { WithSelectors } from "./types"

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
	let store = _store as WithSelectors<typeof _store>
	store.use = {}
	for (let k of Object.keys(store.getState())) {
		;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
	}

	return store
}
