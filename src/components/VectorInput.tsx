import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"

class Vector2 {
	constructor(public x: number, public y: number) {}
}
class Vector3 {
	constructor(public x: number, public y: number, public z: number) {}
}

class Vector4 {
	constructor(public x: number, public y: number, public z: number, public w: number) {}
}

type VectorFromSize<T> = T extends 2
	? Vector2
	: T extends 3
	? Vector3
	: T extends 4
	? Vector4
	: never

interface VectorInputProps<T> {
	size: T
	value: VectorFromSize<T>
	onChange?: (value: VectorFromSize<T>) => void
}

export function VectorInput<T>({ value, onChange }: VectorInputProps<T>) {
	const [vector, setVector] = useState<VectorFromSize<T>>(value)

	const capturingMouse = useRef(new Map<string, boolean>())
	return (
		<div className="flex gap-x-1">
			{Object.entries(vector).map(([key, value]) => (
				<span
					onPointerDown={() => {
						capturingMouse.current.set(key, true)
					}}
					onPointerMove={(e) => {
						if (capturingMouse.current.get(key)) {
							if (document.pointerLockElement !== e.currentTarget) {
								e.currentTarget.requestPointerLock()
							}

							const { movementX, movementY } = e

							// setVector((prev) => {
							// 	return {
							// 		...prev,
							// 		[key]: prev[key as keyof VectorFromSize<T>] + movementX / 20,
							// 	}
							// })
						}
					}}
					onPointerUp={() => {
						capturingMouse.current.set(key, false)
						document.exitPointerLock()
					}}
					key={key}
					className="w-16 text-sm text-white hover:cursor-col-resize text-center truncate"
				>
					{value.toFixed(3)}
				</span>
			))}
		</div>
	)
}
