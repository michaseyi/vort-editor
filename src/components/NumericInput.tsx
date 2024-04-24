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
function roundFloat(number: number): number {
	return +number.toFixed(5)
}
interface NumericInputProps {
	unit: string
	inputName?: string
	step: number
	min?: number
	max?: number
	onChange?: (newVal: number) => void
}
export function NumericInput({
	unit,
	inputName,
	className,
	step,
	onChange,
	...rest
}: NumericInputProps & Omit<HTMLAttributes<HTMLDivElement>, "onChange">) {
	const [active, setActive] = useState(false)
	const [value, setValue] = useState(0)

	const inputRef = useRef<HTMLInputElement>(null)

	const [inputValue, setInputValue] = useState("")

	function increment() {
		setValue((prev) => roundFloat(prev + step))
	}
	function decrement() {
		setValue((prev) => roundFloat(prev - step))
	}
	const pointerCaptureRef = usePointerCapture<HTMLDivElement>((x, y) => {
		setValue((prev) => roundFloat(prev + x * step))
	})

	useEffect(() => {
		onChange && onChange(value)
	}, [value])

	return (
		<div
			className={cn(className, "group flex flex-row items-center overflow-hidden text-shadow")}
			{...rest}
		>
			{!active && (
				<button
					onClick={decrement}
					className="invisible group-hover:visible hover:bg-[rgb(128,128,128)] h-full px-0.5"
				>
					<FaChevronLeft size={8} />
				</button>
			)}

			{active ? (
				<div className="bg-[rgb(38,38,38)] h-full flex-1 px-1.5">
					<input
						ref={inputRef}
						type="text"
						name=""
						id=""
						value={inputValue}
						className="focus:outline-none h-full w-full bg-transparent"
						onBlur={() => {
							setActive(false)

							let newValue = +inputValue

							if (Number.isNaN(newValue)) {
								return
							}
							setValue(roundFloat(newValue))
						}}
						onChange={(e) => {
							setInputValue(e.currentTarget.value)
						}}
					/>
				</div>
			) : (
				<div
					ref={pointerCaptureRef}
					onClick={() => {
						flushSync(() => {
							setActive(true)
							setInputValue(`${value}`)
						})
						inputRef.current!.focus()
					}}
					className={cn(
						"flex-1 cursor-ew-resize select-none hover:bg-[rgb(128,128,128)] h-full flex items-center px-0.5 truncate",
						inputName ? "justify-between gap-x-1" : "justify-center"
					)}
				>
					<span>{inputName && inputName}</span> {trimZeroes((+value.toPrecision(15)).toFixed(5))}{" "}
					{unit}
				</div>
			)}

			{!active && (
				<button
					onClick={increment}
					className="invisible group-hover:visible hover:bg-[rgb(128,128,128)]  h-full px-0.5"
				>
					<FaChevronRight size={8} />
				</button>
			)}
		</div>
	)
}
