"use client"
import { ViewGizmos } from "@/components/ViewGizmos"
import { BoundingBoxSelector } from "@/components/BoundingBoxSelector"
import { RenderWindow, VortECSProvider, useVortState } from "@/vort-ecs-connector"
import { useMediaQuery } from "../../hooks/useMediaQuery"
import { EntityGraph } from "@/components/EntityGraph"
import { VectorInput } from "@/components/VectorInput"

export default function EditorPageWrapper() {
	return (
		<VortECSProvider>
			<EditorPage />
		</VortECSProvider>
	)
}

function EditorPage() {
	const isDesktop = useMediaQuery("(min-width: 768px)")

	return (
		<div className="flex flex-col h-screen divide-y divide-[#444]">
			<TopPanel />
			<div className="flex-1 flex divide-x divide-[#444] min-h-0">
				{/* {isDesktop && <LeftPanel />} */}

				<BoundingBoxSelector
					className="flex-1 relative"
					showHelperBox={true}
					onBoxAvailable={(box) => {
						console.log(box)
					}}
				>
					<RenderWindow className="bg-black w-full h-full " />
					<ViewGizmos className="absolute top-5 right-6" />
				</BoundingBoxSelector>

				{/* {isDesktop && <RightPanel />} */}
			</div>
		</div>
	)
}

function RightPanel() {
	return (
		<section className="bg-[#2c2c2c] min-w-60 divide-y divide-[#444]">
			<VectorInput<2> size={2} value={{ x: 0, y: 0 }} />
		</section>
	)
}
function TopPanel() {
	return <header className="min-h-12 bg-[#2c2c2c]"></header>
}

function LeftPanel() {
	const { isInitialized } = useVortState()
	return (
		<section className="bg-[#2c2c2c] min-w-60 divide-y divide-[#444]">
			{isInitialized && <EntityGraph />}
		</section>
	)
}
