import { usePointerCapture } from "@/hooks/usePointerCapture"
import { cn } from "@/lib/utils"
import { HTMLAttributes, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

function trimZeroes(number: string): string {
	let zeroCount = 0
	for (let i = number.length - 1; i >= 0; i--) {
		if (number[i] === "0") {
			zeroCount++
		} else if (number[i] === ".") {
			zeroCount++
			break
		} else {
			break
		}
	}
	return number.substring(0, number.length - zeroCount)
}

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value))
}

function roundFloat(number: number): number {
	return +number.toFixed(5)
}

type NumericInputVariant = "default" | "small" | "ranged"
interface NumericInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	unit: string
	inputName?: string
	startValue?: number
	step: number
	min?: number
	max?: number
	variant?: NumericInputVariant
	onChange?: (newVal: number) => void
}
export function NumericInput({
	unit,
	inputName,
	className,
	step,
	onChange,
	min = Number.NEGATIVE_INFINITY,
	max = Number.POSITIVE_INFINITY,
	startValue = 0,
	variant = "default",
	...rest
}: NumericInputProps) {
	const [isInputActive, setIsInputActive] = useState(false)

	const [inputValue, setInputValue] = useState(() => clamp(startValue, min, max))

	const [tempInputValue, setTempInputValue] = useState("")

	const inputRef = useRef<HTMLInputElement>(null)

	function incrementInputValue() {
		setInputValue((prev) => clamp(roundFloat(prev + step), min, max))
	}
	function decrementInputValue() {
		setInputValue((prev) => clamp(roundFloat(prev - step), min, max))
	}
	const inputPointerCaptureRef = usePointerCapture<HTMLDivElement>((x, y) => {
		setInputValue((prev) => clamp(roundFloat(prev + x * step), min, max))
	})

	useEffect(() => {
		onChange && onChange(inputValue)
	}, [inputValue])

	return (
		<div
			className={cn(className, "group flex flex-row items-center overflow-hidden text-shadow")}
			{...rest}
		>
			{!isInputActive && !(variant == "ranged") && (
				<button
					onClick={decrementInputValue}
					className="invisible group-hover:visible hover:bg-[rgb(128,128,128)] h-full px-0.5"
				>
					<FaChevronLeft size={8} />
				</button>
			)}

			{isInputActive ? (
				<div className="bg-[rgb(38,38,38)] h-full flex-1 px-1.5">
					<input
						ref={inputRef}
						type="text"
						value={tempInputValue}
						className="focus:outline-none h-full w-full bg-transparent"
						onBlur={() => {
							setIsInputActive(false)

							let newInputValue = unit ? +tempInputValue.split(unit)[0] : +tempInputValue

							if (Number.isNaN(newInputValue)) {
								return
							}

							setInputValue(clamp(roundFloat(newInputValue), min, max))
						}}
						onChange={(e) => {
							setTempInputValue(e.currentTarget.value)
						}}
					/>
				</div>
			) : (
				<div
					ref={inputPointerCaptureRef}
					onClick={() => {
						flushSync(() => {
							setIsInputActive(true)
							setTempInputValue(unit ? `${inputValue} ${unit}` : `${inputValue}`)
						})
						inputRef.current!.focus()
						inputRef.current!.select()
					}}
					style={{
						backgroundImage:
							variant == "ranged"
								? `linear-gradient(to right,  rgb(69,117,188)${
										(100 * (inputValue - min)) / (max - min)
								  }%, transparent ${(100 * (inputValue - min)) / (max - min)}%)`
								: undefined,
					}}
					className={cn(
						"flex-1 cursor-ew-resize select-none active:bg-[rgb(38,38,38)] hover:bg-[rgb(128,128,128)] h-full flex items-center px-0.5 truncate text-inherit",
						inputName ? "justify-between gap-x-1" : "justify-center",
						variant == "ranged" ? "px-4" : undefined
					)}
				>
					{inputName && <span className="flex items-center">{inputName}</span>}
					<span>
						{trimZeroes((+inputValue.toPrecision(15)).toFixed(5))} {unit}
					</span>
				</div>
			)}

			{!isInputActive && !(variant == "ranged") && (
				<button
					onClick={incrementInputValue}
					className="invisible group-hover:visible hover:bg-[rgb(128,128,128)]  h-full px-0.5"
				>
					<FaChevronRight size={8} />
				</button>
			)}
		</div>
	)
}
