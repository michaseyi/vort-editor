"use client"
import { FC, useEffect, useMemo, useState } from "react"
import { RxTriangleRight } from "react-icons/rx"
import { GiCardboardBox } from "react-icons/gi"
import { GoEye } from "react-icons/go"
import { GoEyeClosed } from "react-icons/go"
import { cn } from "@/lib/utils"
import { RxCube } from "react-icons/rx"
import { GoLightBulb } from "react-icons/go"
import { GoDeviceCameraVideo } from "react-icons/go"
import { RxGroup } from "react-icons/rx"

import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { EntityInterface } from "@/lib/editor/types"
import { useEntityChildren } from "@/lib/editor/useEntityChildren"
import { useEntityInfo } from "@/lib/editor/useEntityInfo"
import { useEditorControls } from "@/lib/editor/useEditorControls"
import { useEditorStore } from "@/lib/editor/useEditorStore"
import { KeyState, useKeys } from "@/lib/editor/keyStore"

let interfaceIconMap = new Map<EntityInterface, FC<any>>([
	[EntityInterface.Camera, GoDeviceCameraVideo],
	[EntityInterface.Mesh, RxCube],
	[EntityInterface.Scene, GiCardboardBox],
	[EntityInterface.Light, GoLightBulb],
])

interface EntityNodeProps {
	root?: boolean
	padding: number
	entityID: number
	parentHidden?: boolean
}
export function EntityNode({ root, padding, entityID, parentHidden }: EntityNodeProps) {
	const { entityName, entityInterface } = useEntityInfo(entityID)
	const entityChildren = useEntityChildren(entityID)

	const { removeEntity } = useEditorControls()

	const [isNodeExpanded, setIsNodeExpanded] = useState(root)
	const [isEntityVisible, setIsEntityVisible] = useState(false)

	const editorStore = useEditorStore()
	const selectedEntities = editorStore.use.selectedEntities()
	const selectEntity = editorStore.use.selectEntity()
	const unselectEntity = editorStore.use.unselectEntity()
	const clearSelection = editorStore.use.clearSelection()

	const keys = useKeys()
	const controlKeyState = keys.use.Control()

	const selected = useMemo(() => {
		return selectedEntities.has(entityID)
	}, [selectedEntities, entityID])

	const InterfaceIcon = useMemo(() => {
		return (
			interfaceIconMap.get(entityInterface) ??
			function () {
				return <></>
			}
		)
	}, [entityInterface])

	return (
		<li className={isEntityVisible || parentHidden ? "text-[#787878]" : "text-white/70"}>
			<ContextMenu>
				<ContextMenuTrigger
					tabIndex={1}
					onPointerDown={(e) => {
						e.currentTarget.focus()
						if (controlKeyState === KeyState.Released) {
							clearSelection()
						}

						if (controlKeyState === KeyState.Pressed && selected) {
							unselectEntity(entityID)
						} else {
							selectEntity(entityID)
						}
					}}
					className={cn(
						"peer group pl-0.5 pr-3 py-2 flex gap-x-1 items-center focus:outline-none min-w-max [&>*]:flex-shrink-0",
						selected
							? "bg-[#4A5878]"
							: " hover:!outline  hover:!outline-1 hover:!-outline-offset-1 hover:!outline-[#0C8CE9]"
					)}
				>
					<button
						onPointerDown={(e) => {
							e.stopPropagation()
							setIsNodeExpanded(!isNodeExpanded)
						}}
						style={{
							marginLeft: `${padding}rem`,
						}}
						disabled={entityChildren.length === 0}
						className="disabled:invisible"
					>
						<RxTriangleRight
							className={cn(
								"transition-transform duration-150 text-[#787878]  opacity-[var(--show-ui)]",
								isNodeExpanded ? "rotate-90" : ""
							)}
						/>
					</button>

					<div className="flex-1 flex items-center gap-x-1.5 select-none">
						<InterfaceIcon
							fontSize={"1rem"}
							className={cn(
								isEntityVisible || parentHidden || !selected ? "text-[#787878]" : "text-white",
								"w-4 h-4"
							)}
						/>
						<span
							className={cn(
								"text-[0.7rem] leading-4"
								// root ? "font-semibold " : "font-normal"
							)}
						>
							{entityName}
						</span>
					</div>

					<div className={cn("flex items-center opacity-0 group-hover:opacity-100")}>
						<button
							onPointerDown={(e) => {
								e.stopPropagation()
								setIsEntityVisible(!isEntityVisible)
							}}
						>
							{isEntityVisible ? (
								<GoEyeClosed fontSize={"0.85rem"} />
							) : (
								<GoEye fontSize={"0.85rem"} />
							)}
						</button>
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent className="w-64 bg-[#1E1E1E] border-[#2C2C2C]">
					<ContextMenuItem
						onClick={() => {
							removeEntity(entityID)
						}}
					>
						Delete
						<ContextMenuShortcut>Shift R</ContextMenuShortcut>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			{isNodeExpanded && (
				<ul className={`${selected ? "bg-[#394360]" : ""}`}>
					{entityChildren.map((child) => (
						<EntityNode
							key={child}
							padding={padding + 1.2}
							entityID={child}
							parentHidden={parentHidden || isEntityVisible}
						/>
					))}
				</ul>
			)}
		</li>
	)
}
