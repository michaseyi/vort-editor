import { MainModule } from "./interface"
import {
	ConeCreateOptions,
	CubeCreateOptions,
	CylinderCreateOptions,
	EntityUpdateKind,
	GlobalUpdateKind,
	OrientationGizmoData,
	PlaneCreateOptions,
	Quat,
	TorusCreateOptions,
	UvSphereCreateOptions,
	Vec3,
} from "./types"

export class EditorModuleWrapper {
	private mainModule?: MainModule

	setModule = (mainModule: MainModule) => {
		this.mainModule = mainModule
	}

	getEntityChildren = (entityId: number): number[] => {
		const ptr = this.mainModule!.entityGetChildren(entityId)

		const entityChildren = []

		for (let i = 0; i < ptr.size(); i++) {
			entityChildren.push(ptr.get(i)!)
		}

		return entityChildren
	}

	getEntityPosition = (entityId: number): Vec3 => {
		const ptr = this.mainModule!.entityGetPosition(entityId)
		return this.parseVec3(ptr)
	}

	getEntityScale = (entityId: number): Vec3 => {
		const ptr = this.mainModule!.entityGetScale(entityId)
		return this.parseVec3(ptr)
	}

	getEntityOrientation = (entityId: number): Quat => {
		const ptr = this.mainModule!.entityGetOrientation(entityId)
		return this.parseQuat(ptr)
	}

	setEntityPosition = (entityId: number, position: Partial<Vec3>) => {
		const ptr = this.mainModule!.entityGetPosition(entityId)
		this.setVec3(ptr, position)
		window.__editor_callbacks__.onEntityUpdate(entityId, EntityUpdateKind.Position)
	}

	setEntityScale = (entityId: number, scale: Partial<Vec3>) => {
		const ptr = this.mainModule!.entityGetScale(entityId)
		this.setVec3(ptr, scale)
	}

	setEntityOrientation = (entityId: number, orientation: Partial<Quat>) => {
		const ptr = this.mainModule!.entityGetOrientation(entityId)
		this.setQuat(ptr, orientation)
	}

	getEntityEulerOrientation = (entityId: number): Vec3 => {
		return {
			x: 0,
			y: 0,
			z: 0,
		}
	}

	setEntityEulerOrientation = (entityId: number, orientation: Partial<Vec3>) => {}

	removeEntity = (entityId: number) => {
		this.mainModule!.entitiesRemoveEntity(entityId)
	}

	createCubeMesh = (parentId: number, options: CubeCreateOptions): number => {
		return this.mainModule!.entitiesCreateCubeMesh(parentId)
	}

	createConeMesh = (parentId: number, options: ConeCreateOptions): number => {
		return this.mainModule!.entitiesCreateConeMesh(parentId)
	}

	createTorusMesh = (parentId: number, options: TorusCreateOptions): number => {
		return this.mainModule!.entitiesCreateTorusMesh(parentId)
	}

	createUVSphereMesh = (parentId: number, options: UvSphereCreateOptions): number => {
		return this.mainModule!.entitiesCreateUVSphereMesh(parentId)
	}

	createCylinderMesh = (parentId: number, options: CylinderCreateOptions): number => {
		return this.mainModule!.entitiesCreateCylinderMesh(parentId)
	}

	createPlaneMesh = (parentId: number, options: PlaneCreateOptions): number => {
		return this.mainModule!.entitiesCreatePlaneMesh(parentId)
	}

	shadeMeshSmooth = (entityId: number) => {
		this.mainModule!.meshShadeSmooth(entityId)
	}

	shadeMeshNormal = (entityId: number) => {
		this.mainModule!.meshShadeNormal(entityId)
	}

	getEntityName = (entityId: number): string => {
		return this.ptrToJsString(this.mainModule!.entityGetName(entityId))
	}

	// TODO: Implement
	renameEntity = (entityId: number, name: string) => {
		const ptr = this.jsStringToPtr(name)
	}

	getEntityInterface = (entityId: number): number => {
		return this.mainModule!.entityGetInterface(entityId)
	}

	ptrToJsString = (ptr: number): string => {
		return this.mainModule!.UTF8ToString(ptr)
	}

	jsStringToPtr = (str: string): number => {
		return this.mainModule!.stringToNewUTF8(str)
	}

	createSceneRenderTarget = (canvasSelectorPtr: number) => {
		this.mainModule!.editorCreateRenderOutput(canvasSelectorPtr)
	}

	removeSceneRenderTarget = (canvasSelectorPtr: number) => {
		this.mainModule!.editorDeleteRenderOutput(canvasSelectorPtr)
	}

	triggerSceneRenderTargetUpdate = (canvasSelectorPtr: number) => {
		this.mainModule!.editorUpdateRenderOutput(canvasSelectorPtr)
	}

	getCameraOrientationGizmoDataFromSceneRenderTarget = (
		canvasSelectorPtr: number
	): OrientationGizmoData => {
		const ptr = this.mainModule!.editorGetRotationGizmoData(canvasSelectorPtr)

		return {
			x: this.parseVec3(ptr),
			y: this.parseVec3(ptr + 12),
			z: this.parseVec3(ptr + 24),
			"-x": this.parseVec3(ptr + 36),
			"-y": this.parseVec3(ptr + 48),
			"-z": this.parseVec3(ptr + 60),
		}
	}

	rotateSceneRenderTargetCamera = (canvasSelectorPtr: number, pitch: number, yaw: number) => {
		this.mainModule!.editorRotateCamera(canvasSelectorPtr, pitch, yaw)
		window.__editor_callbacks__.onGlobalUpdate(GlobalUpdateKind.RenderTarget, canvasSelectorPtr)
	}

	zoomSceneRenderTargetCamera = (canvasSelectorPtr: number, zoom: number) => {
		this.mainModule!.editorMoveCamera(canvasSelectorPtr, 0, 0, zoom)
		window.__editor_callbacks__.onGlobalUpdate(GlobalUpdateKind.RenderTarget, canvasSelectorPtr)
	}

	moveSceneRenderTargetCamera = (canvasSelectorPtr: number, x: number, y: number) => {
		this.mainModule!.editorMoveCamera(canvasSelectorPtr, x, y, 0)
		window.__editor_callbacks__.onGlobalUpdate(GlobalUpdateKind.RenderTarget, canvasSelectorPtr)
	}

	renderSceneToTarget = (canvasSelectorPtr: number) => {}

	private setQuat = (ptr: number, quat: Partial<Quat>) => {
		const heap = this.mainModule!.HEAPF32 as Float32Array

		ptr = (ptr / 4) | 0

		if (quat.w !== undefined) {
			heap[ptr] = quat.w
		}

		if (quat.x !== undefined) {
			heap[ptr + 1] = quat.x
		}

		if (quat.y !== undefined) {
			heap[ptr + 2] = quat.y
		}

		if (quat.z !== undefined) {
			heap[ptr + 3] = quat.z
		}
	}

	private setVec3 = (ptr: number, vec: Partial<Vec3>) => {
		const heap = this.mainModule!.HEAPF32 as Float32Array

		ptr = (ptr / 4) | 0

		if (vec.x !== undefined) {
			heap[ptr] = vec.x
		}

		if (vec.y !== undefined) {
			heap[ptr + 1] = vec.y
		}

		if (vec.z !== undefined) {
			heap[ptr + 2] = vec.z
		}
	}

	private parseVec3 = (ptr: number): Vec3 => {
		const heap = this.mainModule!.HEAPF32 as Float32Array

		ptr = (ptr / 4) | 0

		return {
			x: heap[ptr],
			y: heap[ptr + 1],
			z: heap[ptr + 2],
		}
	}

	private parseQuat = (ptr: number): Quat => {
		const heap = this.mainModule!.HEAPF32 as Float32Array

		ptr = (ptr / 4) | 0

		return {
			w: heap[ptr],
			x: heap[ptr + 1],
			y: heap[ptr + 2],
			z: heap[ptr + 3],
		}
	}
}
