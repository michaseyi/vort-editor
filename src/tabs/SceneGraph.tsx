import { TabBody, TabHeader, TabHeaderLeft } from "@/components/Tab"
import { RefreshCcw } from "lucide-react"

import { EntityNode } from "@/components/EntityNode"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Button } from "@/components/Button"
import { useEntityChildren } from "@/lib/editor/useEntityChildren"

export function SceneGraph() {
	const rootEntities = useEntityChildren(0)

	return (
		<section className="h-full flex flex-col rounded-lg overflow-hidden">
			<TabHeader tabName="Scene Graph"></TabHeader>
			<TabBody>
				<ScrollArea
					onPointerEnter={(e) => {
						e.currentTarget.style.setProperty("--show-ui", "1")
					}}
					onPointerLeave={(e) => {
						e.currentTarget.style.setProperty("--show-ui", "0")
					}}
					scrollHideDelay={0}
					className="h-full"
				>
					<ul>
						{rootEntities.map((entityId) => (
							<EntityNode key={entityId} root={true} padding={0} entityID={entityId} />
						))}
					</ul>
				</ScrollArea>
			</TabBody>
		</section>
	)
}
