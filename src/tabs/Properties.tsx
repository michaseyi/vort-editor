import { Button } from "@/components/Button"
import { TabBody, TabHeader } from "@/components/Tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ScrollArea } from "@/components/ui/scroll-area"
import { GiSpanner } from "react-icons/gi"
import { PiGlobeHemisphereEastFill } from "react-icons/pi"
import { FaObjectGroup } from "react-icons/fa"
import { Fragment } from "react"
import { NumericInput } from "@/components/NumericInput"
import { useEntityComponent } from "@/lib/editor/useEntityComponent"
import { ComponentType, EntityInterface } from "@/lib/editor/types"
import { useEditorStore } from "@/lib/editor/useEditorStore"
import { useEntityInfo } from "@/lib/editor/useEntityInfo"
import { useEditorControls } from "@/lib/editor/useEditorControls"


function ObjectProperty() {
	return <div>tab a</div>
}

function ModifierProperty() {
	return <div>tab b</div>
}

function MaterialProperty() {
	const lastSelectedEntity = useEditorStore().use.lastSelectedEntity()!
	const [position, setPosition] = useEntityComponent(lastSelectedEntity, ComponentType.Position)
	const [scale, setScale] = useEntityComponent(lastSelectedEntity, ComponentType.Scale)

	return (
		<ScrollArea className="w-full h-full">
			<div className="p-2">
				<div className="bg-[rgb(55,55,55)] text-[0.7rem] text-shadow text-white/70 rounded-sm py-2.5 px-3">
					<div className="flex flex-col items-end gap-y-2">
						<div className="w-full space-y-[1px]">
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Location X</div>
								<NumericInput
									className="w-[45%] h-5 bg-[rgb(91,91,91)] rounded-tl-[3px]"
									step={0.01}
									onChange={(v) => setPosition({ x: v })}
									unit="m"
									startValue={position.x}
								/>
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Y</div>
								<NumericInput
									startValue={position.y}
									className="w-[45%] h-5 bg-[rgb(91,91,91)] "
									step={0.01}
									unit="m"
									onChange={(v) => setPosition({ y: v })}
								/>
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Z</div>
								<NumericInput
									startValue={position.z}
									className="w-[45%] h-5 bg-[rgb(91,91,91)] rounded-bl-[3px] "
									step={0.01}
									unit="m"
									onChange={(v) => setPosition({ z: v })}
								/>
							</div>
						</div>

						<div className="w-full space-y-[1px]">
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Rotation X</div>
								<NumericInput
									className="w-[45%] h-5 bg-[rgb(91,91,91)] rounded-tl-[3px]"
									step={1}
									unit="&deg;"
								/>
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Y</div>
								<NumericInput className="w-[45%] h-5 bg-[rgb(91,91,91)] " step={1} unit="&deg;" />
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Z</div>
								<NumericInput
									className="w-[45%] h-5 bg-[rgb(91,91,91)] rounded-bl-[3px] "
									step={1}
									unit="&deg;"
								/>
							</div>
						</div>
						<div className="w-full space-y-[1px]">
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Mode</div>
								<Button
									variant="outline"
									text="XYZ Euler"
									className="text-left w-[45%] h-5 rounded-bl-[3px]"
								/>
							</div>
						</div>

						<div className="w-full space-y-[1px]">
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Scale X</div>
								<NumericInput
									className="w-[45%] h-5 bg-[rgb(91,91,91)] rounded-tl-[3px]"
									step={0.01}
									unit=""
									startValue={scale.x}
									onChange={(v) => setScale({ x: v })}
								/>
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Y</div>
								<NumericInput
									startValue={scale.y}
									onChange={(v) => setScale({ y: v })}
									className="w-[45%] h-5 bg-[rgb(91,91,91)] "
									step={0.01}
									unit=""
								/>
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Z</div>
								<NumericInput
									startValue={scale.z}
									onChange={(v) => setScale({ z: v })}
									className="w-[45%] h-5 bg-[rgb(91,91,91)] rounded-bl-[3px] "
									step={0.01}
									unit=""
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ScrollArea>
	)
}

function useIsActiveEntityMesh(): boolean {
	const store = useEditorStore()
	const lastSelectedEntity = store.use.lastSelectedEntity()
	const { getEntityInterface } = useEditorControls()


	if (lastSelectedEntity === null) return false
	if (getEntityInterface(lastSelectedEntity) !== EntityInterface.Mesh) return false
	return true
}

const PropertyTabs = {
	groups: [
		{
			tabs: [
				{
					icon: FaObjectGroup,
					component: ObjectProperty,
					iconColor: "rgb(218, 161, 76)",
					name: "Object",
					condition: useIsActiveEntityMesh,
				},
				{
					icon: GiSpanner,
					component: ModifierProperty,
					iconColor: "rgb(86, 125, 179)",
					name: "Modifier",
					condition: () => true,
				},
				{
					icon: PiGlobeHemisphereEastFill,
					component: MaterialProperty,
					iconColor: "rgb(179, 86, 86)",
					name: "Material",
					condition: useIsActiveEntityMesh,
				},
			],
		},
	],
}

export function Properties() {
	return (
		<section className="h-full flex flex-col rounded-lg overflow-hidden">
			<TabHeader tabName="Properties"></TabHeader>
			<TabBody>
				<Tabs defaultValue="Material" className="flex h-full">
					<ScrollArea hideScrollbar className="w-7 h-full bg-[rgb(23,23,23)] flex-shrink-0">
						<TabsList className="flex flex-col items-center p-0 justify-normal h-full ">
							{PropertyTabs.groups.map((group, groupIdx) => {
								return (
									<div key={groupIdx} className="pt-2 border-b border-black/20 space-y-0.5">
										{group.tabs.map((tab, tabIdx) => {
											return (
												tab.condition() && (
													<TabsTrigger
														value={tab.name}
														style={{ color: tab.iconColor }}
														className="w-7 h-7 bg-transparent hover:bg-[#212020] data-[state=active]:bg-[#2c2c2c] rounded-l-sm flex justify-center items-center"
														key={tabIdx}
													>
														<tab.icon />
													</TabsTrigger>
												)
											)
										})}
									</div>
								)
							})}
						</TabsList>
					</ScrollArea>
					<div className="flex-1 h-full">
						{PropertyTabs.groups.map((group, groupIdx) => {
							return (
								<Fragment key={groupIdx}>
									{group.tabs.map((tab, tabIdx) => {
										return (
											tab.condition() && (
												<TabsContent className="h-full" key={tabIdx} value={tab.name}>
													<tab.component />
												</TabsContent>
											)
										)
									})}
								</Fragment>
							)
						})}
					</div>
				</Tabs>
			</TabBody>
		</section>
	)
}
