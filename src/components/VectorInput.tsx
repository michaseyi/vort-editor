import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { flushSync } from "react-dom"

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

interface VectorDimensionInputProps {
	axis: string
	value: number
	onChange: (value: number) => void
}
function VectorDimensionInput({ axis, value, onChange }: VectorDimensionInputProps) {
	const capturePointer = useRef(false)

	const [showInput, setShowInput] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)
	return (
		<>
			{showInput ? (
				<input
					ref={inputRef}
					type="text"
					className="w-16 text-sm text-center"
					value={value}
					onChange={(e) => {
						onChange(+e.target.value)
					}}
					onBlur={() => {
						setShowInput(false)
					}}
				/>
			) : (
				<span
					onClick={() => {
						console.log("click")
						flushSync(() => {
							setShowInput(true)
						})
						inputRef.current?.focus()
						// show input
					}}
					onPointerDown={() => {
						capturePointer.current = true
					}}
					onPointerMove={(e) => {
						if (capturePointer.current) {
							if (document.pointerLockElement !== e.currentTarget) {
								e.currentTarget.requestPointerLock()
							}

							const { movementX } = e
							onChange(+(value + movementX / 20).toFixed(3))
						}
					}}
					onPointerLeave={() => {
						capturePointer.current = false
						document.exitPointerLock()
					}}
					onPointerUp={() => {
						capturePointer.current = false
						document.exitPointerLock()
					}}
					className="w-16 text-sm text-white hover:cursor-col-resize text-center truncate"
				>
					{value}
				</span>
			)}
		</>
	)
}
export function VectorInput<T>({ value, onChange }: VectorInputProps<T>) {
	const [vector, setVector] = useState<VectorFromSize<T>>(value)

	const capturingMouse = useRef(new Map<string, boolean>())
	return (
		<div className="flex gap-x-1 select-none">
			{Object.entries(vector).map(([axis, value]) => (
				<VectorDimensionInput
					key={axis}
					axis={axis}
					value={value}
					onChange={(value) => {
						setVector((prev) => {
							return {
								...prev,
								[axis]: value,
							}
						})
					}}
				/>
			))}
		</div>
	)
}
