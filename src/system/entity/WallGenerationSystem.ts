import {Engine, Entity, System} from "@nova-engine/ecs";
import {WallSliceEntityFactory} from "../../factories/game/WallSliceEntityFactory";
import {inject} from "inversify";
import {sharedProvide} from "../../util/SharedProvide";
import {WorldPositionComponent} from "../../components/WorldPositionComponent";
import {RenderableComponent} from "../../components/rendering/RenderableComponent";

@sharedProvide(WallGenerationSystem)
export class WallGenerationSystem extends System {
    @inject(WallSliceEntityFactory) wallSliceFactory: WallSliceEntityFactory;
    protected wallEntities: Array<Array<Entity>> = [];

    update(engine: Engine, delta: number): void {
        debugger;
        if (this.wallEntities.length < 2) {
            const wallSlices = this.createNewWall(this.getLastWallOffset());
            this.wallEntities.push(wallSlices);

            wallSlices.forEach((slice: Entity) => {
                engine.addEntity(slice);
            })
        }
    }

    protected getLastWallOffset(): number {
        const lastWall = this.wallEntities.slice(-1)[0];

        if (!lastWall)
            return 0;

        const lastSlice = lastWall.slice(-1)[0];
        const worldPositionComponent = lastSlice.getComponent(WorldPositionComponent);
        const renderableComponent = lastSlice.getComponent(RenderableComponent);

        return worldPositionComponent.x + renderableComponent.sprite.width;
    }

    protected createNewWall(baseOffset: number): Array<Entity> {
        const slices = [];

        slices.push(this.wallSliceFactory.getType('FRONT_EDGE'));

        for (let i = 0; i < 4; i++) {
            slices.push(this.wallSliceFactory.getType('DECORATION'));
        }

        slices.push(this.wallSliceFactory.getType('BACK_EDGE'));

        let wallOffset = 0;
        slices.forEach((slice: Entity) => {
            const worldPositionComponent = slice.getComponent(WorldPositionComponent);
            const renderableComponent = slice.getComponent(RenderableComponent);

            worldPositionComponent.x = baseOffset + wallOffset;
            wallOffset += renderableComponent.sprite.width;
        });
        return slices;
    }

}