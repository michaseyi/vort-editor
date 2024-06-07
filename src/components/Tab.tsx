import { useEffect, useState, createContext, use } from "react"
import {
	Grid2X2,
	Image,
	Rotate3D,
	Clock4,
	Network,
	TableProperties,
	ChevronDown,
	DraftingCompass,
} from "lucide-react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./ui/menubar"
import { cn } from "@/lib/utils"
import { Timeline } from "@/tabs/Timeline"
import { Properties } from "@/tabs/Properties"
import { Viewport } from "@/tabs/Viewport"
import { SceneGraph } from "@/tabs/SceneGraph"
import clsx from "clsx"
import { FaChevronDown } from "react-icons/fa6"
import { NumericInput } from "./NumericInput"

type TabType =
	| "Properties"
	| "Timeline"
	| "3D Viewport"
	| "Scene Graph"
	| "Image Editor"
	| "UV Editor"
	| "Geometry Node Editor"

const TabTypeIconMap: Map<TabType, React.ReactElement> = new Map<TabType, React.ReactElement>([
	["Timeline", <Clock4 className="icon" key="Timeline" />],
	["Properties", <TableProperties className="icon" key="Properties" />],
	["3D Viewport", <Rotate3D className="icon" key="3D Viewport" />],
	["Scene Graph", <Network className="icon" key="Scene Graph" />],
])

const TabTypeComponentMap: Map<TabType, React.ReactElement> = new Map<TabType, React.ReactElement>([
	["Timeline", <Timeline key="Timeline" />],
	["Properties", <Properties key="Properties" />],
	["3D Viewport", <Viewport key="3D Viewport" />],
	["Scene Graph", <SceneGraph key="Scene Graph" />],
])

const TABS: {
	groups: {
		groupName: string
		tabs: { tabName: TabType; tabIcon: JSX.Element; shortcut: string }[]
	}[]
} = {
	groups: [
		{
			groupName: "General",
			tabs: [
				{
					tabName: "3D Viewport",
					tabIcon: <Rotate3D className="icon" />,
					shortcut: "Shift F5",
				},
				{
					tabName: "Image Editor",
					tabIcon: <Image className="icon" />,
					shortcut: "Shift F5",
				},
				{
					tabName: "UV Editor",
					tabIcon: <Grid2X2 className="icon" />,
					shortcut: "Shift F5",
				},
				{
					tabName: "Geometry Node Editor",
					tabIcon: <DraftingCompass className="icon" />,
					shortcut: "Shift F5",
				},
			],
		},
		{
			groupName: "Animation",
			tabs: [{ tabName: "Timeline", tabIcon: <Clock4 className="icon" />, shortcut: "Shift F5" }],
		},
		{
			groupName: "Data",
			tabs: [
				{
					tabName: "Scene Graph",
					tabIcon: <Network className="icon" />,
					shortcut: "Shift F5",
				},
				{
					tabName: "Properties",
					tabIcon: <TableProperties className="icon" />,
					shortcut: "Shift F5",
				},
			],
		},
	],
}

interface TabHeaderMiddleProps {
	children?: React.ReactElement | React.ReactElement[]
}

interface TabHeaderProps extends TabHeaderMiddleProps {
	tabName: TabType
}

interface TabHeaderRightProps extends TabHeaderMiddleProps {}

interface TabHeaderLeftProps extends TabHeaderMiddleProps {}

export function TabHeaderMiddle({ children }: TabHeaderMiddleProps) {
	return <>{children}</>
}

export function TabHeaderLeft({ children }: TabHeaderLeftProps) {
	return <>{children}</>
}

export function TabHeaderRight({ children }: TabHeaderRightProps) {
	return <>{children}</>
}

export function TabHeader({ children, tabName }: TabHeaderProps) {
	type TabComponents = {
		middleComponent?: React.ReactElement
		leftComponent?: React.ReactElement
		rightComponent?: React.ReactElement
	}
	function getComponents() {
		const components: TabComponents = {}

		if (!children) {
			return components
		}

		let childrenElements: React.ReactElement[] = []

		if (children instanceof Array) {
			childrenElements = children
		} else {
			childrenElements.push(children)
		}

		for (let child of childrenElements) {
			switch (child.type) {
				case TabHeaderMiddle:
					components.middleComponent = child
					break
				case TabHeaderLeft:
					components.leftComponent = child
					break
				case TabHeaderRight:
					components.rightComponent = child
					break
			}
		}
		return components
	}
	const [{ leftComponent, rightComponent, middleComponent }, setComponents] =
		useState<TabComponents>(getComponents)

	const { setActiveTab } = use(TabContext)
	useEffect(() => {
		setComponents(getComponents())
	}, [children])

	return (
		<Menubar className={cn(tabName == "3D Viewport" ? "absolute top-0 left-0 w-full  z-10" : "")}>
			<ul
				className={cn(
					"flex [&>*]:flex-1  py-1 px-1  text-white overflow-hidden flex-shrink-0 bg-[rgb(55,55,55)]",
					tabName == "3D Viewport" && "bg-[rgba(55,55,55,0.7)]"
				)}
			>
				<li className="flex gap-x-1 items-center ">
					<MenubarMenu>
						<MenubarTrigger className="outline-button data-[state=open]:bg-[rgb(71,106,194)]  data-[state=open]:border-[rgb(71,106,194)]">
							{TabTypeIconMap.get(tabName)}
							<ChevronDown className="w-3.5 h-3.5" />
						</MenubarTrigger>

						<MenubarContent
							style={{
								backgroundImage:
									"linear-gradient(to bottom, transparent 32px, rgb(44,44,44) 32px,  rgb(44,44,44) 33px, transparent 33px)",
							}}
							className="flex flex-row gap-x-1 text-[0.7rem]"
						>
							{TABS.groups.map(({ groupName, tabs }, idx) => (
								<div key={idx} className="space-y-1">
									<div className="py-1 text-white/60 pl-3">{groupName}</div>
									<div className="min-w-40 py-1.5 space-y-1">
										{tabs.map((tab, idx) => (
											<MenubarItem
												key={idx}
												onClick={() => {
													setActiveTab(tab.tabName)
												}}
												className={cn(
													tabName === tab.tabName
														? "bg-[rgb(71,106,194)] hover:bg-[rgb(71,106,194)]"
														: ""
												)}
											>
												{tab.tabIcon}
												<span className="text-[0.71rem] text-white/80 flex-1 flex items-center mr-4">
													{tab.tabName}
												</span>
												<span className="text-white/60">{tab.shortcut}</span>
											</MenubarItem>
										))}
									</div>
								</div>
							))}
						</MenubarContent>
					</MenubarMenu>
					{leftComponent && leftComponent}
				</li>
				<li className="flex justify-center px-1">{middleComponent && middleComponent}</li>
				<li className="flex gap-x-[1px] justify-end">{rightComponent && rightComponent}</li>
			</ul>

		
		</Menubar>
	)
}

export function TabBody({
	children,
	className,
}: {
	children?: React.ReactNode
	className?: string
}) {
	return <div className={cn("overflow-hidden  flex-1 bg-[#2c2c2c] ", className)}>{children}</div>
}

type TabContextData = {
	setActiveTab: (component: TabType) => void
}
const TabContext = createContext<TabContextData>({} as TabContextData)

export function Tab({ tabName }: { tabName: TabType }) {
	const [activeTab, setActiveTab] = useState<TabType>(tabName)

	return (
		<TabContext.Provider value={{ setActiveTab }}>
			{TabTypeComponentMap.get(activeTab)!}
		</TabContext.Provider>
	)
}
