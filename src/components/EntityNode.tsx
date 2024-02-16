"use client"
import { FC, useEffect, useState } from "react"
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
import { EntityInterface, useEntity, useEntityChildren, useInstance } from "@/vort-ecs-connector"

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
	const instance = useInstance()

	const entityInfo = useEntity(entityID)

	const children = useEntityChildren(entityID)

	const [expanded, setExpanded] = useState(root)
	const [hidden, setHidden] = useState(false)
	const [active, setActive] = useState(false)
	const InterfaceIcon =
		interfaceIconMap.get(entityInfo.interface) ??
		function () {
			return <></>
		}

	return (
		<li className={hidden || parentHidden ? "text-[#787878]" : "text-white"}>
			<ContextMenu>
				<ContextMenuTrigger
					tabIndex={1}
					onPointerDown={(e) => {
						e.currentTarget.focus()
						setActive(true)
					}}
					onBlur={() => {
						setActive(false)
					}}
					className={cn(
						"peer group pl-0.5 pr-3 py-2 flex gap-x-1 items-center focus:outline-none",
						active
							? "bg-[#4A5878]"
							: " hover:!outline  hover:!outline-1 hover:!-outline-offset-1 hover:!outline-[#0C8CE9]"
					)}
				>
					<button
						onPointerDown={(e) => {
							e.stopPropagation()
							setExpanded(!expanded)
						}}
						style={{
							marginLeft: `${padding}rem`,
						}}
						disabled={children.length === 0}
						className="disabled:invisible"
					>
						<RxTriangleRight
							className={cn(
								"transition-transform duration-150 text-[#787878]  opacity-[var(--show-ui)]",
								expanded ? "rotate-90" : ""
							)}
						/>
					</button>

					<div className="flex-1 flex items-center gap-x-1.5 select-none">
						<InterfaceIcon
							fontSize={"1rem"}
							className={cn(
								hidden || parentHidden || !active ? "text-[#787878]" : "text-white",
								"w-4 h-4"
							)}
						/>
						<span
							className={cn("text-[0.69rem] leading-4", root ? "font-semibold " : "font-normal")}
						>
							{entityInfo.name}
						</span>
					</div>

					<div className={cn("flex items-center opacity-0 group-hover:opacity-100")}>
						<button
							onPointerDown={(e) => {
								e.stopPropagation()
								setHidden(!hidden)
							}}
						>
							{hidden ? <GoEyeClosed fontSize={"0.85rem"} /> : <GoEye fontSize={"0.85rem"} />}
						</button>
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent className="w-64 bg-[#1E1E1E] border-[#2C2C2C]">
					<ContextMenuItem
						onClick={() => {
							instance.entitiesRemoveEntity(entityID)
						}}
					>
						Delete
						<ContextMenuShortcut>⌘R</ContextMenuShortcut>
					</ContextMenuItem>
					<ContextMenuSub>
						<ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
						<ContextMenuSubContent className="w-48 bg-[#1E1E1E] border-[#2C2C2C]">
							<ContextMenuItem>
								Save Page As...
								<ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuItem>Create Shortcut...</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>
				</ContextMenuContent>
			</ContextMenu>

			{expanded && (
				<ul className={`${active ? "bg-[#394360]" : ""}`}>
					{children.map((child) => (
						<EntityNode
							key={child}
							padding={padding + 1.2}
							entityID={child}
							parentHidden={parentHidden || hidden}
						/>
					))}
				</ul>
			)}
		</li>
	)
}
