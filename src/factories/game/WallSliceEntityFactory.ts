import {sharedProvide} from "../../util/SharedProvide";
import {Entity} from "@nova-engine/ecs";
import {inject} from "inversify";
import {WallSegmentPool} from "../../pools/WallSegmentPool";
import {RenderableComponent} from "../../components/rendering/RenderableComponent";
import {WorldPositionComponent} from "../../components/WorldPositionComponent";
import {RenderApplication} from "../../services/render/RenderApplication";
import {PhysicsComponent} from "../../components/PhysicsComponent";
import {Bodies, World} from "matter-js";
import {PhysicsService} from "../../services/PhysicsService";

@sharedProvide(WallSliceEntityFactory)
export class WallSliceEntityFactory {

    @inject(RenderApplication) protected renderApplication: RenderApplication;
    @inject(WallSegmentPool) protected wallSegmentPool: WallSegmentPool;
    @inject(PhysicsService) protected physicsService: PhysicsService;

    public getType(type: string): Entity {
        const entity = new Entity();

        const renderableComponent = entity.putComponent(RenderableComponent);
        entity.putComponent(WorldPositionComponent);


        renderableComponent.sprite = this.wallSegmentPool.getSprite(type).sprite;
        renderableComponent.sprite.anchor.set(0.5, 0.5);
        this.renderApplication.getStage().addChild(renderableComponent.sprite);

        const physicsComponent = entity.putComponent(PhysicsComponent);

        physicsComponent.box = Bodies.rectangle(0,
            0,
            renderableComponent.sprite.width,
            renderableComponent.sprite.height - 80,
            {
                isStatic: true
            }
        );

        World.add(this.physicsService.engine.world, [physicsComponent.box]);

        return entity;
    }
}