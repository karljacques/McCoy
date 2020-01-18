import {Engine, Entity, Family, FamilyBuilder, System} from "@nova-engine/ecs";
import {inject} from "inversify";
import {WallEntityFactory} from "../../factories/game/WallEntityFactory";
import {CameraSystem} from "../../services/CameraSystem";
import {TileMapComponent} from "../../components/rendering/TileMapComponent";
import {WorldPositionComponent} from "../../components/WorldPositionComponent";
import {RenderApplication} from "../../services/RenderApplication";
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

            console.log(this.cameraSystem.x);
            if (spriteComponent.boundingBox.maxX < this.cameraSystem.x) {
                this.wallEntityFactory.deconstructWall(spriteComponent);
                this.wallEntities.splice(index, 1);
                console.log('DESTROYING_WALL_ENTITY');
            }

        });

        if (this.wallEntities.length === 0) {
            const wallEntity = this.wallEntityFactory.createWall();
            this.wallEntities.push(wallEntity);

            const position = wallEntity.getComponent(WorldPositionComponent);
            position.x = this.cameraSystem.x - 100;
            position.y = 196;

            this.renderApplication.getStage().addChild(
                wallEntity.getComponent(TileMapComponent).stage
            );
            engine.addEntity(wallEntity);
            console.log('CREATING_WALL_ENTITY');
            console.log(position);
        }
    }
}