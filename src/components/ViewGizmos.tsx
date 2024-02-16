import { cn } from "@/lib/utils"
import { useInstance } from "@/vort-ecs-connector"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

type ViewGizmosAxisDirection = "X" | "-X" | "Y" | "-Y" | "Z" | "-Z"

const ViewGizmosAxisColorMap: Map<ViewGizmosAxisDirection, string> = new Map([
	["X", "#E3342F"],
	["-X", "#E3342F"],
	["Y", "#38C172"],
	["-Y", "#38C172"],
	["Z", "#1678c8"],
	["-Z", "#1678c8"],
])

interface ViewGizmosAxisProps {
	axis: ViewGizmosAxisDirection
	active?: boolean
	position: [number, number]
	jumpToAxis: (axis: ViewGizmosAxisDirection) => void
}

export function ViewGizmosAxis({ axis, position, jumpToAxis }: ViewGizmosAxisProps) {
	const [xPos, yPos] = position

	const isNegative = axis.length === 2

	return (
		<button
			onClick={() => {
				jumpToAxis(axis)
			}}
			style={{
				background: isNegative ? undefined : ViewGizmosAxisColorMap.get(axis),
				borderColor: isNegative ? ViewGizmosAxisColorMap.get(axis) : undefined,
				top: `${yPos * 100}%`,
				left: `${xPos * 100}%`,
				transform: "translate(-50%, -50%)",
			}}
			className={cn(
				"absolute text-[0.7rem] font-bold  w-4 h-4 rounded-full  grid place-items-center hover:text-white hover:font-extrabold transition-colors",
				isNegative ? "border-[1.5px] bg-[rgba(80,80,80,0.5)] text-transparent" : "text-[#1A1A1A]"
			)}
		>
			{axis}
		</button>
	)
}

interface ViewGizmosAxisLinesProps {
	positions: {
		[key: string]: [number, number]
	}
}

export function ViewGizmosAxisLines({ positions }: ViewGizmosAxisLinesProps) {
	const axes: ViewGizmosAxisDirection[] = ["X", "Y", "Z"]
	return (
		<svg viewBox="0 0 100 100" className="w-full h-full">
			{axes.map((axis) => (
				<path
					key={axis}
					d={`M${positions[axis][0] * 100} ${positions[axis][1] * 100} L50 50`}
					strokeWidth="2"
					stroke={ViewGizmosAxisColorMap.get(axis)}
				></path>
			))}
		</svg>
	)
}
interface ViewGizmosProps {
	className?: string
}

export function ViewGizmos({ className }: ViewGizmosProps) {
	// request editor veiw object
	const instance = useInstance()
	const axes: ViewGizmosAxisDirection[] = ["-X", "-Y", "-Z", "X", "Y", "Z"]

	const positions: { [key: string]: [number, number] } = {
		X: [0.9, 0.36],
		Y: [0.5, 0.06],
		Z: [0.79, 0.7],
		"-X": [0.08, 0.63],
		"-Y": [0.5, 0.93],
		"-Z": [0.2, 0.3],
	}

	function jumpToAxis(axis: ViewGizmosAxisDirection) {
		// rotate editor view to axis
		console.log("setting view to", axis)
	}

	const [capturePointer, setCapturePointer] = useState(false)

	return (
		<div
			onPointerDown={(e) => {
				e.stopPropagation()
				setCapturePointer(true)
			}}
			onPointerMove={(e) => {
				if (capturePointer) {
					if (document.pointerLockElement !== e.currentTarget) {
						e.currentTarget.requestPointerLock()
					}
					const { movementX, movementY } = e

					instance.editorCameraRotate(-movementY, -movementX)
				}
			}}
			onPointerUp={(e) => {
				document.exitPointerLock()
				setCapturePointer(false)
			}}
			className={cn(
				className,
				"select-none hover:bg-gray-400/50 hover:shadow-extend shadow-gray-400/50 w-16 h-16 rounded-full transition-[box-shadow,background-color]"
			)}
		>
			<ViewGizmosAxisLines positions={positions} />

			{axes.map((axis) => (
				<ViewGizmosAxis key={axis} axis={axis} position={positions[axis]} jumpToAxis={jumpToAxis} />
			))}
		</div>
	)
}
