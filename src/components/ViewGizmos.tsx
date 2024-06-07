import { usePointerCapture } from "@/hooks/usePointerCapture"
import { OrientationGizmoData, Vec3 } from "@/lib/editor/types"
import { useEditorControls } from "@/lib/editor/useEditorControls"
import { useSceneRenderTargetCameraOrientationGizmoData } from "@/lib/editor/useSceneRenderTargetCameraOrientationGizmoData"
import { cn } from "@/lib/utils"

import { HTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

type ViewGizmosAxisDirection = "x" | "-x" | "y" | "-y" | "z" | "-z"

const ViewGizmosAxisColorMap: Map<ViewGizmosAxisDirection, string> = new Map([
	["x", "#E3342F"],
	["-x", "#E3342F"],
	["y", "#38C172"],
	["-y", "#38C172"],
	["z", "#1678c8"],
	["-z", "#1678c8"],
])

interface ViewGizmosAxisProps {
	axis: ViewGizmosAxisDirection
	active?: boolean
	position: Vec3
	jumpToAxis: (axis: ViewGizmosAxisDirection) => void
}

export function ViewGizmosAxis({ axis, position, jumpToAxis }: ViewGizmosAxisProps) {
	const { x, y, z } = position

	const isNegative = axis.length === 2

	return (
		<button
			onClick={() => {
				jumpToAxis(axis)
			}}
			style={{
				background: isNegative ? undefined : ViewGizmosAxisColorMap.get(axis),
				borderColor: isNegative ? ViewGizmosAxisColorMap.get(axis) : undefined,
				top: `${y * 100}%`,
				left: `${x * 100}%`,
				transform: "translate(-50%, -50%)",
				zIndex: `${Math.round(z * 5 + 10)}`,
			}}
			className={cn(
				"absolute text-[0.7rem] font-bold  w-3.5 h-3.5 rounded-full  grid place-items-center hover:text-white hover:font-extrabold transition-colors",
				isNegative ? "border-[1.5px] bg-[rgb(80,80,80)] text-transparent" : "text-[#1A1A1A]"
			)}
		>
			{/* {axis} */}
		</button>
	)
}

interface ViewGizmosAxisLinesProps {
	positions: OrientationGizmoData
}

export function ViewGizmosAxisLines({ positions }: ViewGizmosAxisLinesProps) {
	const axes: ViewGizmosAxisDirection[] = ["x", "y", "z"]

	return (
		<>
			{axes.map((axis, idx) => (
				<svg
					key={idx}
					style={{
						zIndex: `${Math.round(positions[axis].z * 5 + 10)}`,
					}}
					viewBox="0 0 100 100"
					className="absolute top-0 left-0 w-full h-full"
				>
					<path
						key={axis}
						d={`M${positions[axis].x * 100} ${positions[axis].y * 100} L50 50`}
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
	const axes: ViewGizmosAxisDirection[] = ["-x", "-y", "-z", "x", "y", "z"]

	const positions = useSceneRenderTargetCameraOrientationGizmoData(canvasSelectorPtr)

	const { rotateSceneRenderTargetCamera } = useEditorControls()

	function jumpToAxis(axis: ViewGizmosAxisDirection) {
		console.log("setting view to", axis)
	}

	const ref = usePointerCapture<HTMLDivElement>((movementX, movementY) => {
		rotateSceneRenderTargetCamera(canvasSelectorPtr, -movementY, -movementX)
	})

	return (
		<div
			ref={ref}
			className={cn(
				className,
				"select-none  w-14 h-14 rounded-full transition-[box-shadow,background-color] relative"
				// "select-none hover:bg-gray-400/50 hover:shadow-extend shadow-gray-400/50 w-14 h-14 rounded-full transition-[box-shadow,background-color] relative"
			)}
		>
			<ViewGizmosAxisLines positions={positions} />

			{axes.map((axis) => (
				<ViewGizmosAxis key={axis} axis={axis} position={positions[axis]} jumpToAxis={jumpToAxis} />
			))}
		</div>
	)
}
