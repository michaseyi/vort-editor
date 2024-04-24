import { TabBody, TabHeader, TabHeaderLeft } from "@/components/Tab"
import { RefreshCcw } from "lucide-react"

import { RootEntity, useEntityChildren, useInstance } from "@/lib/ecs-connector"
import { EntityNode } from "@/components/EntityNode"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Button } from "@/components/Button"

export function SceneGraph() {
	const instance = useInstance()

	const [rootEntities, setRootEntities] = useState(() => {
		return instance.entityGetChildren(RootEntity)
	})

	return (
		<section className="h-full flex flex-col">
			<TabHeader tabName="Scene Graph">
				
			</TabHeader>
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
