import { memo, useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { flushSync } from "react-dom"
import { Vec2, Vec3, Vec4 } from "@/lib/editor/types"
import { NumericInput } from "./NumericInput"

class Vector2 {
	constructor(public x: number, public y: number) {}
}
class Vector3 {
	constructor(public x: number, public y: number, public z: number) {}
}

class Vector4 {
	constructor(public x: number, public y: number, public z: number, public w: number) {}
}

type VectorFromSize<T> = T extends 2 ? Vec2 : T extends 3 ? Vec3 : T extends 4 ? Vec4 : never

interface VectorInputProps<T> {
	value: VectorFromSize<T>
	onChange?: (value: VectorFromSize<T>) => void
}

export function VectorInput<T>({ value, onChange }: VectorInputProps<T>) {
	return (
		<div className="flex gap-x-1 select-none">
			{Object.entries(value).map(([axis, componentValue]) => (
				<NumericInput
					inputName={axis}
					key={axis}
					step={0.05}
					unit="m"
					startValue={componentValue}
					onChange={(componentValue) => {
						if (onChange) {
							onChange({
								...value,
								[axis]: componentValue,
							})
						}
					}}
				/>
			))}
		</div>
	)
}

