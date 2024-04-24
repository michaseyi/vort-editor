import { cn } from "@/lib/utils"

import { TfiTimer } from "react-icons/tfi"
import { IoPlaySharp, IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5"

import { FaChevronDown } from "react-icons/fa6"
import { NumericInput } from "../components/NumericInput"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
	TabBody,
	TabHeader,
	TabHeaderLeft,
	TabHeaderMiddle,
	TabHeaderRight,
} from "../components/Tab"
import { usePointerCapture } from "@/hooks/usePointerCapture"
import { Button } from "@/components/Button"
import { flushSync } from "react-dom"

function TimelineControls() {
	interface TimelineControl {
		icon: React.ReactElement
		action: () => void
	}

	const controls: TimelineControl[] = [
		{ action: () => {}, icon: <IoPlaySkipBackSharp /> },
		{ action: () => {}, icon: <IoPlaySharp className="rotate-180" /> },
		{ action: () => {}, icon: <IoPlaySharp /> },
		{ action: () => {}, icon: <IoPlaySkipForwardSharp /> },
	]
	return (
		<ul className="flex gap-x-[1px]">
			{controls.map((control, idx) => (
				<li
					key={idx}
					className="bg-[rgb(91,91,91)] first:rounded-l-[3px] last:rounded-r-[3px] hover:bg-[rgb(128,128,128)] "
				>
					<button className="flex justify-center items-center w-5 h-5 text-white">
						{control.icon}
					</button>
				</li>
			))}
		</ul>
	)
}

export function Timeline() {
	const MIN_STEP_WIDTH = 50
	const MAX_STEP_WIDTH = 120

	const MIN_STEP_WEIGHT = 1
	const MAX_STEP_WEIGHT = 10000

	const [stepWidth, setStepWidth] = useState(75)
	const [stepWeight, setStepWeight] = useState(20)
	const [stepScale, setStepScale] = useState(stepWidth / stepWeight)

	const [offset, setOffset] = useState(200)
	const [nextOffset, setNextOffset] = useState(200)

	const [startFrame, setStartFrame] = useState(0)
	const [startFrameWidth, setStartFrameWidth] = useState(0)
	const [endFrame, setEndFrame] = useState(0)
	const [endFrameWidth, setEndFrameWidth] = useState(0)
	const [currentFrame, setCurrentFrame] = useState(0)
	const [currentFrameWidth, setCurrentFrameWidth] = useState(0)

	const graphContainer = useRef<HTMLDivElement>()

	const [graphContainerWidth, setGraphContainerWidth] = useState(0)
	const [graphContainerHeight, setGraphContainerHeight] = useState(0)

	const graphContainerResizeObserver = useRef<ResizeObserver>()

	function graphContainerRefSetter(element: HTMLDivElement) {
		if (element) {
			graphContainerResizeObserver.current?.observe(element)
		} else {
			graphContainerResizeObserver.current?.unobserve(graphContainer.current!)
		}
		graphContainer.current = element
	}

	const pointerCaptureRef = usePointerCapture<HTMLDivElement>((movementX) => {
		setNextOffset((prev) => {
			prev = Math.trunc(prev + movementX)
			return prev
		})
	})

	useEffect(() => {
		graphContainerResizeObserver.current = new ResizeObserver((entries) => {
			const entry = entries[0]
			setGraphContainerWidth(entry.contentRect.width)
			setGraphContainerHeight(entry.contentRect.height)
		})

		return () => {
			graphContainerResizeObserver.current?.disconnect()
		}
	}, [])

	useEffect(() => {
		setStartFrameWidth(frameCountToScreenWidth(startFrame, nextOffset, stepWidth, stepWeight))
		setEndFrameWidth(frameCountToScreenWidth(endFrame, nextOffset, stepWidth, stepWeight))
		setCurrentFrameWidth(frameCountToScreenWidth(currentFrame, nextOffset, stepWidth, stepWeight))
		setOffset(nextOffset)
	}, [currentFrame, startFrame, stepWidth, stepWeight, endFrame, nextOffset])

	function updateStepData(newWidth: number, centerPosition: number) {
		let newScale = newWidth / stepWeight
		let newWeight = stepWeight

		if (newWidth < MIN_STEP_WIDTH) {
			if (stepWeight.toString(10)[0] === "2") {
				newWeight = Math.min(stepWeight * 2.5, MAX_STEP_WEIGHT)
			} else {
				newWeight = Math.min(stepWeight * 2, MAX_STEP_WEIGHT)
			}
			newWeight === MAX_STEP_WEIGHT ? (newWidth = MIN_STEP_WIDTH) : (newWidth = MAX_STEP_WIDTH)
			newScale = newWidth / newWeight
		} else if (newWidth > MAX_STEP_WIDTH) {
			if (stepWeight.toString(10)[0] === "5") {
				newWeight = Math.max(stepWeight / 2.5, MIN_STEP_WEIGHT)
			} else {
				newWeight = Math.max(stepWeight / 2, MIN_STEP_WEIGHT)
			}
			newWeight === MIN_STEP_WEIGHT ? void 0 : (newWidth = MIN_STEP_WIDTH)
			newScale = newWidth / newWeight
		}

		let centerPointFrameCount = screenWidthToFrameCount(
			centerPosition,
			offset,
			stepWidth,

			stepWeight
		)

		let newCenterPosition = frameCountToScreenWidth(
			centerPointFrameCount,
			offset,
			newWidth,
			newWeight
		)

		setOffset(offset + (centerPosition - newCenterPosition))
		setNextOffset(offset + (centerPosition - newCenterPosition))
		setStepScale(newScale)
		setStepWeight(newWeight)
		setStepWidth(newWidth)
	}

	function screenWidthToFrameCount(
		width: number,
		offset: number,
		stepWidth: number,
		stepWeight: number
	): number {
		return Math.round(((width - offset) / stepWidth) * stepWeight)
	}

	function frameCountToScreenWidth(
		frameCount: number,
		offset: number,
		stepWidth: number,
		stepWeight: number
	): number {
		return (frameCount * stepWidth) / stepWeight + offset
	}

	return (
		<section className="h-full flex flex-col">
			<TabHeader tabName="Timeline">
				<TabHeaderLeft>
					<Button variant="outline" text="Playback" />
					<Button text="View" />
					<Button text="Marker" />
				</TabHeaderLeft>
				<TabHeaderMiddle>
					<TimelineControls />
				</TabHeaderMiddle>
				<TabHeaderRight>
					<NumericInput
						unit=""
						className="w-16 h-5 text-[0.7rem] bg-[rgb(91,91,91)] text-white rounded-[3px] mr-1"
						onChange={setCurrentFrame}
						step={1}
						min={0}
					/>

					<button className="bg-[rgb(91,91,91)] hover:bg-[rgb(128,128,128)] h-5 w-5 rounded-l-[3px] text-white flex justify-center items-center">
						<TfiTimer />
					</button>

					<NumericInput
						unit=""
						inputName="Start"
						className="w-24 h-5 text-[0.7rem] bg-[rgb(91,91,91)] text-white"
						onChange={setStartFrame}
						step={1}
						min={0}
					/>
					<NumericInput
						unit=""
						inputName="End"
						className="w-24 h-5 text-[0.7rem] bg-[rgb(91,91,91)] text-white rounded-r-[3px]"
						onChange={setEndFrame}
						step={1}
						min={0}
					/>
				</TabHeaderRight>
			</TabHeader>
			<TabBody>
				<div
					tabIndex={0}
					ref={pointerCaptureRef}
					onWheel={(e) => {
						updateStepData(
							stepWidth - e.deltaY * 0.05,
							e.clientX - e.currentTarget.getBoundingClientRect().x
						)
					}}
					className={cn("h-full w-full outline-none flex flex-col relative")}
				>
					<div className="bg-[rgb(32,32,32)]">
						<div
							className="flex text-shadow text-white/70 text-[0.7rem] items-center h-6 select-none"
							style={{
								marginLeft: `${offset % stepWidth}px`,
								columnGap: `${stepWidth}px`,
							}}
						>
							{Array.from({ length: 30 }).map((_, idx) => {
								return (
									<div key={idx} className="relative h-full ">
										<div className="absolute top-0 left-0 translate-x-[-50%]  grid place-items-center h-full">
											{(idx - Math.trunc(offset / stepWidth)) * stepWeight}
										</div>
									</div>
								)
							})}
						</div>
					</div>

					<div
						style={{
							backgroundImage: `linear-gradient(to right, transparent ${
								currentFrameWidth - 1
							}px, rgb(42,68,159) ${currentFrameWidth - 1}px,  rgb(42,68,159) ${
								currentFrameWidth + 1
							}px, transparent ${
								currentFrameWidth + 1
							}px),  linear-gradient(to right, #00000063 1px, transparent 1px), linear-gradient(to right, transparent ${startFrameWidth}px, black ${startFrameWidth}px, black ${
								startFrameWidth + 1
							}px,  #72161650 ${
								startFrameWidth + 1
							}px,#72161650 ${endFrameWidth}px, black ${endFrameWidth}px, black ${
								endFrameWidth + 1
							}px,  transparent ${endFrameWidth + 1}px)`,
							backgroundSize: `auto, ${stepWidth}px, auto, auto`,
							backgroundPosition: `0, ${offset}px, 0, 0`,
							backgroundRepeat: "no-repeat, repeat, no-repeat, no-repeat",
						}}
						ref={graphContainerRefSetter}
						className="flex-1"
					>
						<TimelineGraph
							width={graphContainerWidth}
							height={graphContainerHeight}
							startFrame={screenWidthToFrameCount(0, offset, stepWidth, stepWeight)}
							endFrame={screenWidthToFrameCount(graphContainerWidth, offset, stepWidth, stepWeight)}
						/>
					</div>

					<div
						style={{
							left: `${currentFrameWidth}px`,
						}}
						className="text-shadow select-none absolute top-0 h-4 mt-1 text-[0.7rem] flex items-center justify-center translate-x-[-50%] text-white/70 bg-[rgb(42,68,159)] px-1 rounded-sm"
					>
						{currentFrame}
					</div>
				</div>
			</TabBody>
		</section>
	)
}

interface TimelineGraphProps {
	width: number
	height: number
	startFrame: number
	endFrame: number
	data?: GraphData[]
}

type GraphData = {
	name: string
	color: string
	points: [number, number]
}

function TimelineGraph({ width, height, startFrame, endFrame, data }: TimelineGraphProps) {
	return (
		<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
			{/* <linearGradient id="grad1" x1="0%" x2="0%" y1="100%" y2="0%">
				<stop
					offset="0%"
					style={{
						stopColor: "rgba(179, 117, 224, 0.334)",
					}}
				/>
				<stop
					offset="100%"
					style={{
						stopColor: "rgba(1, 1, 1, 0)",
					}}
				/>
			</linearGradient> */}

			{/* <path d={`M0 0 L${width} ${height}`} stroke="black" strokeWidth={1}></path> */}
		</svg>
	)
}
