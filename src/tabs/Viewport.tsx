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

import { FaChevronDown } from "react-icons/fa6"
import { EditorMode } from "@/lib/editor/types"
import { useEditorControls } from "@/lib/editor/useEditorControls"
import { useSceneRenderTarget } from "@/lib/editor/useSceneRenderTarget"

const OBJECT_INTERACTION_MODES = [
	{ type: EditorMode.EditMode, name: "Edit Mode" },
	{ type: EditorMode.SculptMode, name: "Sculpt Mode" },
	{ type: EditorMode.ObjectMode, name: "Object Mode" },
]

function ObjectInteractionModeMenu() {
	const [currentViewMode, setCurrentViewMode] = useState(OBJECT_INTERACTION_MODES[0].type)

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
					{OBJECT_INTERACTION_MODES[currentViewMode].name}
				</span>
				<FaChevronDown size={8} />
			</MenubarTrigger>
			<MenubarContent className="space-y-1">
				{OBJECT_INTERACTION_MODES.map((viewMode) => (
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
	const {
		createCubeMesh,
		createUVSphereMesh,
		createCylinderMesh,
		createConeMesh,
		createPlaneMesh,
		createTorusMesh,
	} = useEditorControls()

	return (
		<MenubarSub>
			<MenubarSubTrigger>
				<Pyramid className="icon" />
				Mesh
			</MenubarSubTrigger>
			<MenubarSubContent>
				<MenubarItem onClick={() => createCubeMesh(1, {} as any)}>
					<Box className="icon" />
					Cube
				</MenubarItem>
				<MenubarItem onClick={() => createUVSphereMesh(1, {} as any)}>
					<Globe className="icon" />
					UVSphere
				</MenubarItem>
				<MenubarItem onClick={() => createCylinderMesh(1, {} as any)}>
					<Cylinder className="icon" />
					Cylinder
				</MenubarItem>
				<MenubarItem onClick={() => createConeMesh(1, {} as any)}>
					<Cone className="icon" />
					Cone
				</MenubarItem>

				<MenubarItem onClick={() => createPlaneMesh(1, {} as any)}>
					<Square className="icon" />
					Plane
				</MenubarItem>
				<MenubarItem onClick={() => createTorusMesh(1, {} as any)}>
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

export function Viewport() {
	const [isReady, canvasId, renderTargetId] = useSceneRenderTarget()

	const { zoomSceneRenderTargetCamera } = useEditorControls()

	return (
		<section className="h-full flex flex-col relative rounded-lg overflow-hidden">
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
			<TabBody className="rounded-t-lg">
				<BoundingBoxSelector className="h-full" showHelperBox>
					<div className="h-full relative">
						<div className="overflow-hidden  relative w-full h-full">
							<canvas
								onWheel={(e) => {
									if (!isReady) return
									zoomSceneRenderTargetCamera(renderTargetId, e.deltaY * 0.3)
								}}
								className="absolute top-0 left-0"
								id={canvasId}
							></canvas>
						</div>

						{isReady && (
							<div className="absolute top-10 right-6 gap-y-4 flex flex-col items-center select-none">
								<ViewGizmos canvasSelectorPtr={renderTargetId} />

								{/* Controls */}
								<div className="flex flex-col items-center gap-y-1">
									<MoveView canvasSelectorPtr={renderTargetId} />
									<Zoom canvasSelectorPtr={renderTargetId} />
									<ToggleCameraView canvasSelectorPtr={renderTargetId} />
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
	const { zoomSceneRenderTargetCamera } = useEditorControls()
	const ref = usePointerCapture<HTMLButtonElement>((_: number, movementY: number) => {
		zoomSceneRenderTargetCamera(canvasSelectorPtr, movementY * 2.5)
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
	const { moveSceneRenderTargetCamera } = useEditorControls()
	const ref = usePointerCapture<HTMLButtonElement>((movementX, movementY) => {
		moveSceneRenderTargetCamera(canvasSelectorPtr, -movementX, movementY)
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
