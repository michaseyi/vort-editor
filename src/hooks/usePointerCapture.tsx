"use client"
import { useCallback, useEffect, useRef } from "react"

export function usePointerCapture<T extends HTMLElement>(
	callback: (movementX: number, movementY: number) => void
): (element: T) => void {
	const capturePointer = useRef(false)
	const elementRef = useRef<T>()

	const prevTouchData = useRef({ x: 0, y: 0 })

	const onTouchStart = useCallback((e: TouchEvent) => {
		e.stopPropagation()
		prevTouchData.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
		capturePointer.current = true
	}, [])

	const onTouchEnd = useCallback((e: TouchEvent) => {
		capturePointer.current = false
	}, [])

	const onMouseDown = useCallback((e: MouseEvent) => {
		e.stopPropagation()
		capturePointer.current = true
	}, [])

	const onMouseMove = useRef((e: MouseEvent) => {
		if (!capturePointer.current) {
			return
		}

		if (document.pointerLockElement !== e.currentTarget) {
			;(e.currentTarget as T)?.requestPointerLock()
		}
		const { movementX, movementY } = e

		callback(movementX, movementY)
	})

	const onTouchMove = useRef((e: TouchEvent) => {
		if (!capturePointer.current) {
			return
		}
		const { clientX, clientY } = e.touches[0]

		const movementX = Math.round(clientX - prevTouchData.current.x)
		const movementY = Math.round(clientY - prevTouchData.current.y)

		callback(movementX, movementY)
		prevTouchData.current = { x: clientX, y: clientY }
	})

	const onMouseEnd = useCallback((e: MouseEvent) => {
		capturePointer.current = false
		document?.exitPointerLock()
	}, [])

	useEffect(() => {
		document.body.removeEventListener("mousemove", onMouseMove.current)
		onMouseMove.current = (e: MouseEvent) => {
			if (!capturePointer.current) {
				return
			}

			if (document.pointerLockElement !== e.currentTarget) {
				;(e.currentTarget as T)?.requestPointerLock()
			}
			const { movementX, movementY } = e

			callback(movementX, movementY)
		}

		document.body.addEventListener("mousemove", onMouseMove.current)
	}, [callback])
	
	function ref(element: T) {
		if (element) {
			element.addEventListener("mousedown", onMouseDown)
			element.addEventListener("touchstart", onTouchStart)

			document.body.addEventListener("mousemove", onMouseMove.current)
			document.body.addEventListener("touchmove", onTouchMove.current)
			document.body.addEventListener("touchend", onTouchEnd)
			document.body.addEventListener("mouseup", onMouseEnd)
			document.body.addEventListener("mouseleave", onMouseEnd)
		} else {
			elementRef.current!.removeEventListener("mousedown", onMouseDown)
			elementRef.current!.removeEventListener("touchstart", onTouchStart)
			document.body.removeEventListener("touchmove", onTouchMove.current)
			document.body.removeEventListener("touchend", onTouchEnd)
			document.body.removeEventListener("mousemove", onMouseMove.current)
			document.body.removeEventListener("mouseup", onMouseEnd)
			document.body.removeEventListener("mouseleave", onMouseEnd)
		}
		elementRef.current = element
	}

	return ref
}
