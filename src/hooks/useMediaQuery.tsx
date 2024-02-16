"use client"
import { useEffect, useRef, useState } from "react"

export function useMediaQuery(mediaQuery: string): boolean {
	const queryResultRef = useRef<MediaQueryList>()

	const [result, setResult] = useState(true)

	useEffect(() => {
		queryResultRef.current = window.matchMedia(mediaQuery)

		setResult(queryResultRef.current.matches)

		function onQueryResultChange(event: MediaQueryListEvent) {
			setResult(event.matches)
		}
		queryResultRef.current?.addEventListener("change", onQueryResultChange)
		return () => {
			queryResultRef.current?.removeEventListener("change", onQueryResultChange)
		}
	}, [mediaQuery])

	return result
}
