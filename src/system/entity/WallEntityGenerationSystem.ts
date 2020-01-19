import {Engine, Entity, System} from "@nova-engine/ecs";
import {inject} from "inversify";
import {WallEntityFactory} from "../../factories/game/WallEntityFactory";
import {CameraSystem} from "../../services/render/CameraSystem";
import {TileMapComponent} from "../../components/rendering/TileMapComponent";
import {WorldPositionComponent} from "../../components/WorldPositionComponent";
import {RenderApplication} from "../../services/render/RenderApplication";
import {sharedProvide} from "../../util/SharedProvide";

@sharedProvide(WallEntityGenerationSystem)
export class WallEntityGenerationSystem extends System {
    protected wallEntities: Array<Entity> = [];

    @inject(CameraSystem) protected cameraSystem: CameraSystem;
    @inject(WallEntityFactory) protected wallEntityFactory: WallEntityFactory;
    @inject(RenderApplication) protected renderApplication: RenderApplication;

    update(engine: Engine, delta: number): void {
        // Should entities be unloaded?
        this.wallEntities.forEach((entity: Entity, index) => {
            const spriteComponent = entity.getComponent(TileMapComponent);
            const worldPositionComponent = entity.getComponent(WorldPositionComponent);

            if (worldPositionComponent.x + spriteComponent.boundingBox.maxX < this.cameraSystem.x) {
                this.wallEntityFactory.deconstructWall(spriteComponent);
                this.wallEntities.splice(index, 1);
                console.log('DESTROYING_WALL_ENTITY');
            }

        });

        if (this.wallEntities.length < 3) {
            console.log('CREATING_WALL_ENTITY');
            const wallEntity = this.wallEntityFactory.createWall();

            const position = wallEntity.getComponent(WorldPositionComponent);

            position.x = this.getNextWallPosition();

            this.renderApplication.getStage().addChild(
                wallEntity.getComponent(TileMapComponent).stage
            );

            this.wallEntities.push(wallEntity);
            engine.addEntity(wallEntity);
        }
    }

    protected getNextWallPosition(): number {
        // Get the last entity in the list, work out its far edge
        const lastWallEntity = this.wallEntities.slice(-1)[0];

        console.log(lastWallEntity);
        if (lastWallEntity) {
            const worldPositionComponent = lastWallEntity.getComponent(WorldPositionComponent);
            const tileMapComponent = lastWallEntity.getComponent(TileMapComponent);

            const furthestEdge = tileMapComponent.boundingBox.maxX;
            console.log(furthestEdge);
            return worldPositionComponent.x + furthestEdge + (Math.random() * 20) + 5;
        }

        return this.cameraSystem.x + 100;
    }
}