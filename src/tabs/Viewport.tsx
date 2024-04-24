import { Button } from "@/components/Button"
import {
	Pyramid,
	Tangent,
	Diameter,
	Spline,
	Box,
	Cylinder,
	Cone,
	Torus,
	Square,
	Globe,
	PenLine,
	Slice,
	Shapes,
	Magnet,
	Move3D,
	BringToFront,
	Blend,
} from "lucide-react"

import {
	TabBody,
	TabHeader,
	TabHeaderLeft,
	TabHeaderMiddle,
	TabHeaderRight,
} from "@/components/Tab"
import { FaCircle } from "react-icons/fa"
import { PiGlobeHemisphereEastFill } from "react-icons/pi"
import { ImSphere } from "react-icons/im"
import { LuMove3D } from "react-icons/lu"
import { TbGizmo } from "react-icons/tb"
import { BsEyeFill } from "react-icons/bs"
import { AiOutlineAim } from "react-icons/ai"

import { FaSquareFull } from "react-icons/fa"

import { ViewGizmos } from "@/components/ViewGizmos"
import { BoundingBoxSelector } from "@/components/BoundingBoxSelector"
import { useInstance } from "@/lib/ecs-connector"
import { GoZoomIn } from "react-icons/go"
import { GoDeviceCameraVideo } from "react-icons/go"

import { IoMoveSharp } from "react-icons/io5"
import { usePointerCapture } from "@/hooks/usePointerCapture"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSub,
	MenubarTrigger,
	MenubarSubContent,
	MenubarSubTrigger,
} from "@/components/ui/menubar"
import { OBJECT_INTERRACTION_MODES, ObjectInterractionMode } from "@/lib/editor-plugin/objects"
import { FaChevronDown } from "react-icons/fa6"

function ObjectInteractionModeMenu() {
	const [currentViewMode, setCurrentViewMode] = useState(OBJECT_INTERRACTION_MODES[0].type)

	const OBJECT_INTERACTION_MODE_ICONS = [
		<Shapes className="icon" key="Object Mode" />,
		<PenLine className="icon" key="Edit Mode" />,
		<Slice className="icon" key="Sculpt Mode" />,
	]

	return (
		<MenubarMenu>
			<MenubarTrigger className="outline-button data-[state=open]:bg-[rgb(71,106,194)]  data-[state=open]:border-[rgb(71,106,194)]">
				{OBJECT_INTERACTION_MODE_ICONS[currentViewMode]}
				<span className="outline-button-text">
					{OBJECT_INTERRACTION_MODES[currentViewMode].name}
				</span>
				<FaChevronDown size={8} />
			</MenubarTrigger>
			<MenubarContent className="space-y-1">
				{OBJECT_INTERRACTION_MODES.map((viewMode) => (
					<MenubarItem
						className={cn(
							currentViewMode === viewMode.type && "bg-[rgb(71,106,194)] hover:bg-[rgb(71,106,194)]"
						)}
						onClick={() => {
							setCurrentViewMode(viewMode.type)
						}}
						key={viewMode.type}
					>
						{OBJECT_INTERACTION_MODE_ICONS[viewMode.type]}
						<span>{viewMode.name}</span>
					</MenubarItem>
				))}
			</MenubarContent>
		</MenubarMenu>
	)
}

function ViewMenu() {
	return <MenubarMenu></MenubarMenu>
}

function AddMeshSubMenu() {
	const instance = useInstance()

	return (
		<MenubarSub>
			<MenubarSubTrigger>
				<Pyramid className="icon" />
				Mesh
			</MenubarSubTrigger>
			<MenubarSubContent>
				<MenubarItem onClick={() => instance.module.entitiesCreateCubeMesh(1)}>
					<Box className="icon" />
					Cube
				</MenubarItem>
				<MenubarItem onClick={() => instance.module.entitiesCreateUVSphereMesh(1)}>
					<Globe className="icon" />
					UVSphere
				</MenubarItem>
				<MenubarItem onClick={() => instance.module.entitiesCreateCylinderMesh(1)}>
					<Cylinder className="icon" />
					Cylinder
				</MenubarItem>
				<MenubarItem onClick={() => instance.module.entitiesCreateConeMesh(1)}>
					<Cone className="icon" />
					Cone
				</MenubarItem>

				<MenubarItem onClick={() => instance.module.entitiesCreatePlaneMesh(1)}>
					<Square className="icon" />
					Plane
				</MenubarItem>
				<MenubarItem onClick={() => instance.module.entitiesCreateTorusMesh(1)}>
					<Torus className="icon" />
					Torus
				</MenubarItem>
			</MenubarSubContent>
		</MenubarSub>
	)
}

function AddCurveSubMenu() {
	return (
		<MenubarSub>
			<MenubarSubTrigger>
				<Tangent className="icon" />
				Curve
			</MenubarSubTrigger>
			<MenubarSubContent>
				<MenubarItem>
					<Spline className="icon" />
					Bezier
				</MenubarItem>
				<MenubarItem>
					<Diameter className="icon" />
					Circle
				</MenubarItem>
			</MenubarSubContent>
		</MenubarSub>
	)
}

function AddMenu() {
	return (
		<MenubarMenu>
			<MenubarTrigger className="default-button data-[state=open]:bg-white/10">
				<span className="default-button-text">Add</span>
			</MenubarTrigger>
			<MenubarContent className="space-y-1">
				<AddMeshSubMenu />
				<AddCurveSubMenu />
			</MenubarContent>
		</MenubarMenu>
	)
}

type EditorState = {
	objectInterractionMode: ObjectInterractionMode
}

export function Viewport() {
	const instance = useInstance()

	const [canvasID] = useState<string>(() => {
		return `c${crypto.randomUUID()}`
	})

	// TODO: This pointer should be deallocated at the end of the lifetime of this component
	const [canvasSelectorPtr] = useState<number>(() => {
		return instance.module.stringToNewUTF8(`#${canvasID}`)
	})

	const resizeObserver = useRef<ResizeObserver>()

	const [canvasContainer, setCanvasContainer] = useState<HTMLDivElement>()

	const [renderOutputCreated, setRenderOutputCreated] = useState(false)

	function containerRef(container: HTMLDivElement) {
		if (!container) {
			return
		}

		if (resizeObserver.current) {
			return
		}

		if (canvasContainer) {
			return
		}

		setCanvasContainer(container)
	}

	useEffect(() => {
		if (!canvasContainer) return

		resizeObserver.current = new ResizeObserver((entries) => {
			const entry = entries[0]
			const { width, height } = entry.contentRect

			const canvas = entry.target.firstElementChild as HTMLCanvasElement

			// setting _width and _height instead of width and height because setting width and height on
			// a canvas element clears the canvas extra cpu overhead (causes noticable lags when resizing the canvas).
			// So instead, we store the updated width and height in the _width and _height member variable till the
			//next animation frame where the canvas will be updated.
			;(canvas as any)._width = width * window.devicePixelRatio
			;(canvas as any)._height = height * window.devicePixelRatio

			instance.module.editorUpdateRenderOutput(canvasSelectorPtr)
		})

		resizeObserver.current.observe(canvasContainer)

		const { width, height } = canvasContainer.getBoundingClientRect()

		const canvas = canvasContainer.firstElementChild as HTMLCanvasElement

		;(canvas as any)._width = width * window.devicePixelRatio
		;(canvas as any)._height = height * window.devicePixelRatio

		instance.module.editorCreateRenderOutput(canvasSelectorPtr)

		setRenderOutputCreated(true)

		return () => {
			resizeObserver.current?.disconnect()
			instance.module.editorDeleteRenderOutput(canvasSelectorPtr)
		}
	}, [canvasContainer])
	return (
		<section className="h-full flex flex-col">
			<TabHeader tabName="3D Viewport">
				<TabHeaderLeft>
					<ObjectInteractionModeMenu />
					<AddMenu />
					<Button text="View" />
					<Button text="Select" />
					<Button text="Object" />
				</TabHeaderLeft>
				<TabHeaderMiddle>
					<div className="flex gap-x-1.5">
						<Button variant="outline" text="Global" icon={<Move3D className="icon" />} />
						<Button variant="outline" icon={<Blend className="icon" />} />

						<div className="flex">
							<Button
								variant="iconOnly"
								icon={<Magnet className="icon" />}
								className="rounded-l-[4px]"
							/>
							<Button
								variant="outline"
								icon={<FaSquareFull />}
								className="rounded-l-[0px] rounded-r-[4px]"
							/>
						</div>
					</div>
				</TabHeaderMiddle>
				<TabHeaderRight>
					<div className="flex gap-x-1.5">
						<Button variant="outline" icon={<BsEyeFill />} />
						<div className="flex">
							<Button variant="iconOnly" icon={<TbGizmo />} className="rounded-l-[4px]" />
							<Button variant="dropDownOnly" className="rounded-l-[0px] rounded-r-[4px]" />
						</div>

						<div className="flex">
							<div className="flex gap-x-[1px]">
								<Button variant="iconOnly" icon={<ImSphere />} className="rounded-l-[4px]" />
								<Button variant="iconOnly" icon={<FaCircle />} />
								<Button variant="iconOnly" icon={<PiGlobeHemisphereEastFill />} />
							</div>
							<Button variant="dropDownOnly" className="rounded-l-[0px] rounded-r-[4px]" />
						</div>
					</div>
				</TabHeaderRight>
			</TabHeader>
			<TabBody>
				<BoundingBoxSelector className="h-full" showHelperBox>
					<div className="h-full relative">
						<div ref={containerRef} className="overflow-hidden  relative  w-full h-full">
							<canvas
								onWheel={(e) => {
									if (!renderOutputCreated) return
									instance.editorMoveCamera(canvasSelectorPtr, 0, 0, e.deltaY)
								}}
								className="absolute top-0 left-0"
								id={canvasID}
							></canvas>
						</div>

						{renderOutputCreated && (
							<div className="absolute top-5 right-6 gap-y-4 flex flex-col items-center select-none">
								<ViewGizmos canvasSelectorPtr={canvasSelectorPtr} />

								{/* Controls */}
								<div className="flex flex-col items-center gap-y-1">
									<MoveView canvasSelectorPtr={canvasSelectorPtr} />
									<Zoom canvasSelectorPtr={canvasSelectorPtr} />
									<ToggleCameraView canvasSelectorPtr={canvasSelectorPtr} />
								</div>
							</div>
						)}
					</div>
				</BoundingBoxSelector>
			</TabBody>
		</section>
	)
}

function ToggleCameraView({ canvasSelectorPtr }: { canvasSelectorPtr: number }) {
	return (
		<Button
			variant="iconOnly"
			className="rounded-full w-7 h-7 aspect-square bg-[#14141468] hover:bg-[#80808072]"
			icon={<GoDeviceCameraVideo />}
		></Button>
	)
}

function Zoom({ canvasSelectorPtr }: { canvasSelectorPtr: number }) {
	const instance = useInstance()

	const ref = usePointerCapture<HTMLButtonElement>((movementX: number, movementY: number) => {
		instance.editorMoveCamera(canvasSelectorPtr, 0, 0, movementY * 2.5)
	})

	return (
		<Button
			ref={ref}
			variant="iconOnly"
			className="rounded-full w-7 h-7 aspect-square bg-[#14141468] hover:bg-[#80808072]"
			icon={<GoZoomIn />}
		></Button>
	)
}

function MoveView({ canvasSelectorPtr }: { canvasSelectorPtr: number }) {
	const instance = useInstance()

	const ref = usePointerCapture<HTMLButtonElement>((movementX, movementY) => {
		instance.editorMoveCamera(canvasSelectorPtr, -movementX, movementY, 0)
	})

	return (
		<Button
			ref={ref}
			variant="iconOnly"
			className="rounded-full w-7 h-7 aspect-square bg-[#14141468] hover:bg-[#80808072]"
			icon={<IoMoveSharp />}
		></Button>
	)
}
