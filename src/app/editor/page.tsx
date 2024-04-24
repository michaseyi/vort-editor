"use client"
import { VortECSProvider } from "@/lib/ecs-connector"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tab } from "@/components/Tab"
import { NodeEditor } from "@/components/NodeEditor"

export default function EditorPageWrapper() {
	return (
		<VortECSProvider>
			<EditorPage />
		</VortECSProvider>
	)
}

function EditorPage() {
	return (
		<div style={{ height: "100dvh" }} className=" bg-[rgb(28,28,28)] p-1">
			<ResizablePanelGroup direction="horizontal" className="gap-[1px]">
				<ResizablePanel defaultSize={85} minSize={5}>
					<ResizablePanelGroup direction="vertical" className="gap-[1px]">
						<ResizablePanel defaultSize={90} minSize={10}>
							<Tab tabName="3D Viewport" />
						</ResizablePanel>
						<ResizableHandle className="bg-transparent" />
						<ResizablePanel defaultSize={10}>
							<Tab tabName="Timeline" />
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
				<ResizableHandle className="bg-transparent" />
				<ResizablePanel defaultSize={15}>
					<ResizablePanelGroup direction="vertical" className="gap-[1px]">
						<ResizablePanel defaultSize={30}>
							<Tab tabName="Scene Graph" />
						</ResizablePanel>
						<ResizableHandle className="bg-transparent" />
						<ResizablePanel defaultSize={70}>
							<Tab tabName="Properties" />
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	)
}
