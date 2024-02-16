"use client"
import { useRef } from "react"

type BoundingBox = {
	left: number
	top: number
	right: number
	bottom: number
}
interface BoundingBoxSelectorProps {
	onBoxAvailable?: (box: BoundingBox) => void
	children?: React.ReactNode
	className?: string
	showHelperBox?: boolean
}
export function BoundingBoxSelector({
	children,
	onBoxAvailable,
	className,
	showHelperBox,
}: BoundingBoxSelectorProps) {
	let boundingBoxRef = useRef<BoundingBox>()

	let helperBoxRef = useRef<HTMLSpanElement>(null)

	function saveBoundingBox(containerRect: DOMRect) {
		const { top, left } = containerRect

		if (boundingBoxRef.current) {
			if (boundingBoxRef.current.left > boundingBoxRef.current.right) {
				let temp = boundingBoxRef.current.left
				boundingBoxRef.current.left = boundingBoxRef.current.right
				boundingBoxRef.current.right = temp
			}

			if (boundingBoxRef.current.top > boundingBoxRef.current.bottom) {
				let temp = boundingBoxRef.current.top
				boundingBoxRef.current.top = boundingBoxRef.current.bottom
				boundingBoxRef.current.bottom = temp
			}

			boundingBoxRef.current.top -= top
			boundingBoxRef.current.bottom -= top
			boundingBoxRef.current.left -= left
			boundingBoxRef.current.right -= left

			onBoxAvailable && onBoxAvailable(boundingBoxRef.current)

			boundingBoxRef.current = undefined

			if (helperBoxRef.current) {
				helperBoxRef.current.style.width = "0"
				helperBoxRef.current.style.height = "0"
				helperBoxRef.current.style.display = "none"
			}
		}
	}

	return (
		<div
			onPointerDown={(e) => {
				if (e.button != 0) return

				const { clientX, clientY } = e

				boundingBoxRef.current = {
					left: clientX,
					top: clientY,
					right: clientX,
					bottom: clientY,
				}
			}}
			onPointerMove={(e) => {
				if (boundingBoxRef.current) {
					const { movementX, movementY } = e

					boundingBoxRef.current.bottom += movementY
					boundingBoxRef.current.right += movementX

					if (helperBoxRef.current) {
						if (helperBoxRef.current.style.display != "inline") {
							helperBoxRef.current.style.display = "inline"
						}
						const width = boundingBoxRef.current.right - boundingBoxRef.current.left
						const height = boundingBoxRef.current.bottom - boundingBoxRef.current.top

						if (width < 0) {
							helperBoxRef.current.style.left = `${boundingBoxRef.current.right}px`
						} else {
							helperBoxRef.current.style.left = `${boundingBoxRef.current.left}px`
						}
						if (height < 0) {
							helperBoxRef.current.style.top = `${boundingBoxRef.current.bottom}px`
						} else {
							helperBoxRef.current.style.top = `${boundingBoxRef.current.top}px`
						}

						helperBoxRef.current.style.width = `${Math.abs(width)}px`
						helperBoxRef.current.style.height = `${Math.abs(height)}px`
					}
				}
			}}
			onPointerUp={(e) => {
				saveBoundingBox(e.currentTarget.getBoundingClientRect())
			}}
			onPointerLeave={(e) => {
				saveBoundingBox(e.currentTarget.getBoundingClientRect())
			}}
			className={`${className} relative`}
		>
			{children}

			{showHelperBox && (
				<span
					ref={helperBoxRef}
					className="fixed bg-[#0c8de928]  border-[#0C8CE9] border hidden"
				></span>
			)}
		</div>
	)
}
