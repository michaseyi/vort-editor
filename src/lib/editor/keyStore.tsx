import { StoreApi, UseBoundStore, create } from "zustand"
import { createSelectors } from "./createSelectors"
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react"

export enum KeyState {
	Pressed,
	Released,
}

export enum Key {
	Backspace = "Backspace",
	Tab = "Tab",
	Enter = "Enter",
	Shift = "Shift",
	Ctrl = "Control",
	Alt = "Alt",
	Pause = "Pause",
	CapsLock = "CapsLock",
	Escape = "Escape",
	Space = "Space",
	PageUp = "PageUp",
	PageDown = "PageDown",
	End = "End",
	Home = "Home",
	ArrowLeft = "ArrowLeft",
	ArrowUp = "ArrowUp",
	ArrowRight = "ArrowRight",
	ArrowDown = "ArrowDown",
	PrintScreen = "PrintScreen",
	Insert = "Insert",
	Delete = "Delete",
	Digit0 = "Digit0",
	Digit1 = "Digit1",
	Digit2 = "Digit2",
	Digit3 = "Digit3",
	Digit4 = "Digit4",
	Digit5 = "Digit5",
	Digit6 = "Digit6",
	Digit7 = "Digit7",
	Digit8 = "Digit8",
	Digit9 = "Digit9",
	KeyA = "KeyA",
	KeyB = "KeyB",
	KeyC = "KeyC",
	KeyD = "KeyD",
	KeyE = "KeyE",
	KeyF = "KeyF",
	KeyG = "KeyG",
	KeyH = "KeyH",
	KeyI = "KeyI",
	KeyJ = "KeyJ",
	KeyK = "KeyK",
	KeyL = "KeyL",
	KeyM = "KeyM",
	KeyN = "KeyN",
	KeyO = "KeyO",
	KeyP = "KeyP",
	KeyQ = "KeyQ",
	KeyR = "KeyR",
	KeyS = "KeyS",
	KeyT = "KeyT",
	KeyU = "KeyU",
	KeyV = "KeyV",
	KeyW = "KeyW",
	KeyX = "KeyX",
	KeyY = "KeyY",
	KeyZ = "KeyZ",
	Meta = "Meta",
	ContextMenu = "ContextMenu",
	Numpad0 = "Numpad0",
	Numpad1 = "Numpad1",
	Numpad2 = "Numpad2",
	Numpad3 = "Numpad3",
	Numpad4 = "Numpad4",
	Numpad5 = "Numpad5",
	Numpad6 = "Numpad6",
	Numpad7 = "Numpad7",
	Numpad8 = "Numpad8",
	Numpad9 = "Numpad9",
	NumpadMultiply = "NumpadMultiply",
	NumpadAdd = "NumpadAdd",
	NumpadSubtract = "NumpadSubtract",
	NumpadDecimal = "NumpadDecimal",
	NumpadDivide = "NumpadDivide",
	F1 = "F1",
	F2 = "F2",
	F3 = "F3",
	F4 = "F4",
	F5 = "F5",
	F6 = "F6",
	F7 = "F7",
	F8 = "F8",
	F9 = "F9",
	F10 = "F10",
	F11 = "F11",
	F12 = "F12",
	NumLock = "NumLock",
	ScrollLock = "ScrollLock",
	Semicolon = "Semicolon",
	Equal = "Equal",
	Comma = "Comma",
	Minus = "Minus",
	Period = "Period",
	Slash = "Slash",
	Backquote = "Backquote",
	BracketLeft = "BracketLeft",
	Backslash = "Backslash",
	BracketRight = "BracketRight",
	Quote = "Quote",
}

const keyCodeToKeyMap: { [code: string]: Key } = {
	Backspace: Key.Backspace,
	Tab: Key.Tab,
	Enter: Key.Enter,
	ShiftLeft: Key.Shift,
	ShiftRight: Key.Shift,
	ControlLeft: Key.Ctrl,
	ControlRight: Key.Ctrl,
	AltLeft: Key.Alt,
	AltRight: Key.Alt,
	Pause: Key.Pause,
	CapsLock: Key.CapsLock,
	Escape: Key.Escape,
	Space: Key.Space,
	PageUp: Key.PageUp,
	PageDown: Key.PageDown,
	End: Key.End,
	Home: Key.Home,
	ArrowLeft: Key.ArrowLeft,
	ArrowUp: Key.ArrowUp,
	ArrowRight: Key.ArrowRight,
	ArrowDown: Key.ArrowDown,
	PrintScreen: Key.PrintScreen,
	Insert: Key.Insert,
	Delete: Key.Delete,
	Digit0: Key.Digit0,
	Digit1: Key.Digit1,
	Digit2: Key.Digit2,
	Digit3: Key.Digit3,
	Digit4: Key.Digit4,
	Digit5: Key.Digit5,
	Digit6: Key.Digit6,
	Digit7: Key.Digit7,
	Digit8: Key.Digit8,
	Digit9: Key.Digit9,
	KeyA: Key.KeyA,
	KeyB: Key.KeyB,
	KeyC: Key.KeyC,
	KeyD: Key.KeyD,
	KeyE: Key.KeyE,
	KeyF: Key.KeyF,
	KeyG: Key.KeyG,
	KeyH: Key.KeyH,
	KeyI: Key.KeyI,
	KeyJ: Key.KeyJ,
	KeyK: Key.KeyK,
	KeyL: Key.KeyL,
	KeyM: Key.KeyM,
	KeyN: Key.KeyN,
	KeyO: Key.KeyO,
	KeyP: Key.KeyP,
	KeyQ: Key.KeyQ,
	KeyR: Key.KeyR,
	KeyS: Key.KeyS,
	KeyT: Key.KeyT,
	KeyU: Key.KeyU,
	KeyV: Key.KeyV,
	KeyW: Key.KeyW,
	KeyX: Key.KeyX,
	KeyY: Key.KeyY,
	KeyZ: Key.KeyZ,
	MetaLeft: Key.Meta,
	MetaRight: Key.Meta,
	ContextMenu: Key.ContextMenu,
	Numpad0: Key.Numpad0,
	Numpad1: Key.Numpad1,
	Numpad2: Key.Numpad2,
	Numpad3: Key.Numpad3,
	Numpad4: Key.Numpad4,
	Numpad5: Key.Numpad5,
	Numpad6: Key.Numpad6,
	Numpad7: Key.Numpad7,
	Numpad8: Key.Numpad8,
	Numpad9: Key.Numpad9,
	NumpadMultiply: Key.NumpadMultiply,
	NumpadAdd: Key.NumpadAdd,
	NumpadSubtract: Key.NumpadSubtract,
	NumpadDecimal: Key.NumpadDecimal,
	NumpadDivide: Key.NumpadDivide,
	F1: Key.F1,
	F2: Key.F2,
	F3: Key.F3,
	F4: Key.F4,
	F5: Key.F5,
	F6: Key.F6,
	F7: Key.F7,
	F8: Key.F8,
	F9: Key.F9,
	F10: Key.F10,
	F11: Key.F11,
	F12: Key.F12,
	NumLock: Key.NumLock,
	ScrollLock: Key.ScrollLock,
	Semicolon: Key.Semicolon,
	Equal: Key.Equal,
	Comma: Key.Comma,
	Minus: Key.Minus,
	Period: Key.Period,
	Slash: Key.Slash,
	Backquote: Key.Backquote,
	BracketLeft: Key.BracketLeft,
	Backslash: Key.Backslash,
	BracketRight: Key.BracketRight,
	Quote: Key.Quote,
}

export type KeyStore = KeyStates & {
	rules: Set<Rule>
}

type KeyStates = {
	[K in Key]: KeyState
}

export type KeyAction = {
	setKeyState: (key: Key, state: KeyState) => void
	addRule: (rule: Rule) => () => void
}

const DEFAULT_KEY_STATES: KeyStore = {
	[Key.Backspace]: KeyState.Released,
	[Key.Tab]: KeyState.Released,
	[Key.Enter]: KeyState.Released,
	[Key.Shift]: KeyState.Released,
	[Key.Ctrl]: KeyState.Released,
	[Key.Alt]: KeyState.Released,
	[Key.Pause]: KeyState.Released,
	[Key.CapsLock]: KeyState.Released,
	[Key.Escape]: KeyState.Released,
	[Key.Space]: KeyState.Released,
	[Key.PageUp]: KeyState.Released,
	[Key.PageDown]: KeyState.Released,
	[Key.End]: KeyState.Released,
	[Key.Home]: KeyState.Released,
	[Key.ArrowLeft]: KeyState.Released,
	[Key.ArrowUp]: KeyState.Released,
	[Key.ArrowRight]: KeyState.Released,
	[Key.ArrowDown]: KeyState.Released,
	[Key.PrintScreen]: KeyState.Released,
	[Key.Insert]: KeyState.Released,
	[Key.Delete]: KeyState.Released,
	[Key.Digit0]: KeyState.Released,
	[Key.Digit1]: KeyState.Released,
	[Key.Digit2]: KeyState.Released,
	[Key.Digit3]: KeyState.Released,
	[Key.Digit4]: KeyState.Released,
	[Key.Digit5]: KeyState.Released,
	[Key.Digit6]: KeyState.Released,
	[Key.Digit7]: KeyState.Released,
	[Key.Digit8]: KeyState.Released,
	[Key.Digit9]: KeyState.Released,
	[Key.KeyA]: KeyState.Released,
	[Key.KeyB]: KeyState.Released,
	[Key.KeyC]: KeyState.Released,
	[Key.KeyD]: KeyState.Released,
	[Key.KeyE]: KeyState.Released,
	[Key.KeyF]: KeyState.Released,
	[Key.KeyG]: KeyState.Released,
	[Key.KeyH]: KeyState.Released,
	[Key.KeyI]: KeyState.Released,
	[Key.KeyJ]: KeyState.Released,
	[Key.KeyK]: KeyState.Released,
	[Key.KeyL]: KeyState.Released,
	[Key.KeyM]: KeyState.Released,
	[Key.KeyN]: KeyState.Released,
	[Key.KeyO]: KeyState.Released,
	[Key.KeyP]: KeyState.Released,
	[Key.KeyQ]: KeyState.Released,
	[Key.KeyR]: KeyState.Released,
	[Key.KeyS]: KeyState.Released,
	[Key.KeyT]: KeyState.Released,
	[Key.KeyU]: KeyState.Released,
	[Key.KeyV]: KeyState.Released,
	[Key.KeyW]: KeyState.Released,
	[Key.KeyX]: KeyState.Released,
	[Key.KeyY]: KeyState.Released,
	[Key.KeyZ]: KeyState.Released,
	[Key.Meta]: KeyState.Released,
	[Key.ContextMenu]: KeyState.Released,
	[Key.Numpad0]: KeyState.Released,
	[Key.Numpad1]: KeyState.Released,
	[Key.Numpad2]: KeyState.Released,
	[Key.Numpad3]: KeyState.Released,
	[Key.Numpad4]: KeyState.Released,
	[Key.Numpad5]: KeyState.Released,
	[Key.Numpad6]: KeyState.Released,
	[Key.Numpad7]: KeyState.Released,
	[Key.Numpad8]: KeyState.Released,
	[Key.Numpad9]: KeyState.Released,
	[Key.NumpadMultiply]: KeyState.Released,
	[Key.NumpadAdd]: KeyState.Released,
	[Key.NumpadSubtract]: KeyState.Released,
	[Key.NumpadDecimal]: KeyState.Released,
	[Key.NumpadDivide]: KeyState.Released,
	[Key.F1]: KeyState.Released,
	[Key.F2]: KeyState.Released,
	[Key.F3]: KeyState.Released,
	[Key.F4]: KeyState.Released,
	[Key.F5]: KeyState.Released,
	[Key.F6]: KeyState.Released,
	[Key.F7]: KeyState.Released,
	[Key.F8]: KeyState.Released,
	[Key.F9]: KeyState.Released,
	[Key.F10]: KeyState.Released,
	[Key.F11]: KeyState.Released,
	[Key.F12]: KeyState.Released,
	[Key.NumLock]: KeyState.Released,
	[Key.ScrollLock]: KeyState.Released,
	[Key.Semicolon]: KeyState.Released,
	[Key.Equal]: KeyState.Released,
	[Key.Comma]: KeyState.Released,
	[Key.Minus]: KeyState.Released,
	[Key.Period]: KeyState.Released,
	[Key.Slash]: KeyState.Released,
	[Key.Backquote]: KeyState.Released,
	[Key.BracketLeft]: KeyState.Released,
	[Key.Backslash]: KeyState.Released,
	[Key.BracketRight]: KeyState.Released,
	[Key.Quote]: KeyState.Released,
	rules: new Set(),
}

export function createKeyStore() {
	const store = create<KeyStore & KeyAction>()((set) => ({
		...DEFAULT_KEY_STATES,
		setKeyState: (key, state) => set({ [key]: state }),
		addRule: (rule) => {
			set((state) => {
				const rules = new Set(state.rules)
				rules.add(rule)
				return { rules }
			})
			return () => {
				set((state) => {
					const rules = new Set(state.rules)
					rules.delete(rule)
					return { rules }
				})
			}
		},
	}))

	return createKeyComboSelector(createSelectors(store))
}

export type WithKeyComboSelector<S> = S extends { getState: () => infer T }
	? S & {
			use: {
				Combo: (...keys: Key[]) => KeyState
			}
	  }
	: never

function createKeyComboSelector(
	_store: ReturnType<typeof createSelectors<UseBoundStore<StoreApi<KeyStore & KeyAction>>>>
) {
	let store = _store as WithKeyComboSelector<typeof _store>

	const useCombo = (...comboKeys: Key[]): KeyState => {
		const keys = useKeys()

		const keyStates = comboKeys.map((key) => keys.use[key]())

		const [comboState, setComboState] = useState(KeyState.Released)

		useEffect(() => {
			if (keyStates.every(isPressed)) {
				setComboState(KeyState.Pressed)
			} else {
				setComboState(KeyState.Released)
			}
		}, keyStates)

		return comboState
	}

	store.use.Combo = useCombo
	return store
}

const KeyContext = createContext<ReturnType<typeof createKeyStore> | null>(null)

export function KeyProvider({ children }: { children?: React.ReactNode }) {
	const store = useRef(createKeyStore()).current

	const setKeyState = store.use.setKeyState()

	const onKeyDown = useCallback((ev: KeyboardEvent) => {
		setKeyState(keyCodeToKeyMap[ev.code], KeyState.Pressed)

		const state = store.getState()

		for (const rule of state.rules) {
			if (rule(state)) {
				ev.preventDefault()
				return
			}
		}
	}, [])
	const onKeyUp = useCallback((ev: KeyboardEvent) => {
		setKeyState(keyCodeToKeyMap[ev.code], KeyState.Released)
	}, [])

	useLayoutEffect(() => {
		document.addEventListener("keydown", onKeyDown)
		document.addEventListener("keyup", onKeyUp)
		return () => {
			document.removeEventListener("keydown", onKeyDown)
			document.removeEventListener("keyup", onKeyUp)
		}
	}, [])

	return <KeyContext.Provider value={store}>{children}</KeyContext.Provider>
}

export type Rule = (state: KeyStore) => boolean

export function useKeys(rule?: Rule) {
	const keyContext = useContext(KeyContext)

	if (!keyContext) throw new Error("KeyContext.Provider missing in tree")

	const addRule = keyContext.use.addRule()

	useLayoutEffect(() => {
		if (rule) {
			return addRule(rule)
		}
	}, [])

	return keyContext
}

export function isPressed(keyState: KeyState) {
	return keyState === KeyState.Pressed
}
export function isReleased(keyState: KeyState) {
	return keyState === KeyState.Released
}
