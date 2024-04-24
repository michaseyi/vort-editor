import { use, createContext, useContext, useState } from "react"

type ParentContextData = {
	activeChild: string
	setActiveChild: (activeChild: string) => void
}

const ParentContext = createContext<ParentContextData>({} as ParentContextData)

type ParentProps = {
	defaultChild: string
	children: React.ReactNode
}
export function Parent({ children, defaultChild }: ParentProps) {
	const [activeChild, setActiveChild] = useState(defaultChild)
	return (
		<ParentContext.Provider value={{ activeChild, setActiveChild }}>
			{children}
		</ParentContext.Provider>
	)
}

type ChildChangeProps = {
	value: string
	children: React.ReactNode
}

export function ChildChanger({ value, children }: ChildChangeProps) {
	const parentContext = use(ParentContext)
	return (
		<button
			onClick={() => {
				parentContext.setActiveChild(value)
			}}
		>
			{children}
		</button>
	)
}

type ChildProps = {
	value: string
	children: React.ReactNode
	asChild?: boolean
}
export function Child({ value, children, asChild }: ChildProps) {
	const parentContext = use(ParentContext)

	if (parentContext.activeChild !== value) {
		return <></>
	}

	if (asChild) {
		return children
	}

	return <div>{children}</div>
}
