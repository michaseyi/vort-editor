import { Button } from "@/components/Button"
import { TabBody, TabHeader } from "@/components/Tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ScrollArea } from "@/components/ui/scroll-area"
import { GiSpanner } from "react-icons/gi"
import { PiGlobeHemisphereEastFill } from "react-icons/pi"
import { FaObjectGroup } from "react-icons/fa"
import { Fragment } from "react"
import { NumericInput } from "@/components/NumericInput"
function randomColor(): string {
	const letters = "0123456789ABCDEF"
	let color = "#"
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

function ObjectProperty() {
	return <div>tab a</div>
}

function ModifierProperty() {
	return <div>tab b</div>
}

function MaterialProperty() {
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
									unit="m"
								/>
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Y</div>
								<NumericInput className="w-[45%] h-5 bg-[rgb(91,91,91)] " step={1} unit="m" />
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Z</div>
								<NumericInput
									className="w-[45%] h-5 bg-[rgb(91,91,91)] rounded-bl-[3px] "
									step={1}
									unit="m"
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
									step={1}
									unit=""
								/>
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Y</div>
								<NumericInput className="w-[45%] h-5 bg-[rgb(91,91,91)] " step={1} unit="" />
							</div>
							<div className="flex gap-x-2">
								<div className="flex-1 truncate text-right">Z</div>
								<NumericInput
									className="w-[45%] h-5 bg-[rgb(91,91,91)] rounded-bl-[3px] "
									step={1}
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

const PropertyTabs = {
	groups: [
		{
			tabs: [
				{
					icon: FaObjectGroup,
					component: ObjectProperty,
					iconColor: "rgb(218, 161, 76)",
					name: "Object",
				},
				{
					icon: GiSpanner,
					component: ModifierProperty,
					iconColor: "rgb(86, 125, 179)",
					name: "Modifier",
				},
				{
					icon: PiGlobeHemisphereEastFill,
					component: MaterialProperty,
					iconColor: "rgb(179, 86, 86)",
					name: "Material",
				},
			],
		},
	],
}

export function Properties() {
	return (
		<section className="h-full flex flex-col">
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
												<TabsTrigger
													value={tab.name}
													style={{ color: tab.iconColor }}
													className="w-7 h-7 bg-transparent hover:bg-[#212020] data-[state=active]:bg-[#2c2c2c] rounded-l-sm flex justify-center items-center"
													key={tabIdx}
												>
													<tab.icon />
												</TabsTrigger>
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
											<TabsContent className="h-full" key={tabIdx} value={tab.name}>
												<tab.component />
											</TabsContent>
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
