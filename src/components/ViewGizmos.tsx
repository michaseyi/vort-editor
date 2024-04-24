import { usePointerCapture } from "@/hooks/usePointerCapture"
import { cn } from "@/lib/utils"
import { ViewGizmoData, useInstance } from "@/lib/ecs-connector"
import { HTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

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
	position: [number, number, number]
	jumpToAxis: (axis: ViewGizmosAxisDirection) => void
}

export function ViewGizmosAxis({ axis, position, jumpToAxis }: ViewGizmosAxisProps) {
	const [xPos, yPos, depth] = position

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
				zIndex: `${Math.round(depth * 5 + 10)}`,
			}}
			className={cn(
				"absolute text-[0.7rem] font-bold  w-4 h-4 rounded-full  grid place-items-center hover:text-white hover:font-extrabold transition-colors",
				isNegative ? "border-[1.5px] bg-[rgb(80,80,80)] text-transparent" : "text-[#1A1A1A]"
			)}
		>
			{axis}
		</button>
	)
}

interface ViewGizmosAxisLinesProps {
	positions: ViewGizmoData
}

export function ViewGizmosAxisLines({ positions }: ViewGizmosAxisLinesProps) {
	const axes: ViewGizmosAxisDirection[] = ["X", "Y", "Z"]

	return (
		<>
			{axes.map((axis, idx) => (
				<svg
					key={idx}
					style={{
						zIndex: `${Math.round(positions[axis][2] * 5 + 10)}`,
					}}
					viewBox="0 0 100 100"
					className="absolute top-0 left-0 w-full h-full"
				>
					<path
						key={axis}
						d={`M${positions[axis][0] * 100} ${positions[axis][1] * 100} L50 50`}
						strokeWidth="3"
						stroke={ViewGizmosAxisColorMap.get(axis)}
					></path>
				</svg>
			))}
		</>
	)
}
interface ViewGizmosProps extends HTMLAttributes<HTMLDivElement> {
	canvasSelectorPtr: number
}

export function ViewGizmos({ className, canvasSelectorPtr }: ViewGizmosProps) {
	// request editor veiw object
	const instance = useInstance()
	const axes: ViewGizmosAxisDirection[] = ["-X", "-Y", "-Z", "X", "Y", "Z"]

	const [positions, setPositions] = useState<ViewGizmoData>(() =>
		instance.editorGetViewGizmoData(canvasSelectorPtr)
	)

	function jumpToAxis(axis: ViewGizmosAxisDirection) {
		// rotate editor view to axis
		console.log("setting view to", axis)
	}

	const ref = usePointerCapture<HTMLDivElement>((movementX, movementY) => {
		instance.editorRotateCamera(canvasSelectorPtr, -movementY, -movementX)
		setPositions(instance.editorGetViewGizmoData(canvasSelectorPtr))
	})

	return (
		<div
			ref={ref}
			className={cn(
				className,
				// "select-none  w-14 h-14 rounded-full transition-[box-shadow,background-color] relative"
				"select-none hover:bg-gray-400/50 hover:shadow-extend shadow-gray-400/50 w-14 h-14 rounded-full transition-[box-shadow,background-color] relative"
			)}
		>
			<ViewGizmosAxisLines positions={positions} />

			{axes.map((axis) => (
				<ViewGizmosAxis key={axis} axis={axis} position={positions[axis]} jumpToAxis={jumpToAxis} />
			))}
		</div>
	)
}
