import {sharedProvide} from "../../util/SharedProvide";
import {Entity} from "@nova-engine/ecs";
import {inject} from "inversify";
import {WallSegmentPool} from "../../pools/WallSegmentPool";
import {RenderableComponent} from "../../components/rendering/RenderableComponent";
import {WorldPositionComponent} from "../../components/WorldPositionComponent";
import {RenderApplication} from "../../services/render/RenderApplication";

@sharedProvide(WallSliceEntityFactory)
export class WallSliceEntityFactory {

    @inject(RenderApplication) protected renderApplication: RenderApplication;
    @inject(WallSegmentPool) protected wallSegmentPool: WallSegmentPool;

    public getType(type: string): Entity {
        const entity = new Entity();

        const renderableComponent = entity.putComponent(RenderableComponent);
        entity.putComponent(WorldPositionComponent);

        renderableComponent.sprite = this.wallSegmentPool.getSprite(type).sprite;
        this.renderApplication.getStage().addChild(renderableComponent.sprite);

        return entity;
    }
}