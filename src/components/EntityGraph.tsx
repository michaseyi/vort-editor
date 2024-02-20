"use client"
import { RootEntity, useEntityChildren } from "@/vort-ecs-connector"
import { EntityNode } from "./EntityNode"
import { ScrollArea } from "@/components/ui/scroll-area"

export function EntityGraph() {
	const rootEntities = useEntityChildren(RootEntity)

	return (
		<ScrollArea
			onPointerEnter={(e) => {
				e.currentTarget.style.setProperty("--show-ui", "1")
			}}
			onPointerLeave={(e) => {
				e.currentTarget.style.setProperty("--show-ui", "0")
			}}
			scrollHideDelay={0}
			className="h-[80%]"
		>
			<ul>
				{rootEntities.map((entityId) => (
					<EntityNode key={entityId} root={true} padding={0} entityID={entityId} />
				))}
			</ul>
		</ScrollArea>
	)
}
