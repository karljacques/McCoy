import {Engine, Entity, Family, FamilyBuilder, System} from "@nova-engine/ecs";
import {RenderApplication} from "../../services/RenderApplication";
import {decorate, inject, injectable} from "inversify";
import {sharedProvide} from "../../util/SharedProvide";
import {RenderableComponent} from "../../components/rendering/RenderableComponent";
import {WorldPositionComponent} from "../../components/WorldPositionComponent";

// Eurgh, why does the parent have to be injectable?
decorate(injectable(), System);

// @provide makes this class injectable, but also binds this class to the given identifier
// @sharedProvide makes one instance shared through the entire container - a "singleton"
// although I don't agree with the term
// https://github.com/inversify/inversify-binding-decorators/
@sharedProvide(SideScrollingCameraRenderingSystem)
export class SideScrollingCameraRenderingSystem extends System {
    @inject(RenderApplication) protected renderApplication: RenderApplication;

    protected family: Family;
    protected x = 0;
    protected y = 0;

    onAttach(engine: Engine): void {
        this.family = new FamilyBuilder(engine).include(RenderableComponent).build();
    }

    update(engine: Engine, delta: number): void {

        this.x -= 0.05 * delta;

        this.family.entities.forEach((entity: Entity) => {
            const renderableComponent = entity.getComponent(RenderableComponent);

            if (entity.hasComponent(WorldPositionComponent)) {
                const worldPositionComponent = entity.getComponent(WorldPositionComponent);
                const dX = this.x - worldPositionComponent.x;
                const dY = worldPositionComponent.y - this.y;

                renderableComponent.setScreenPosition(dX, dY);

            } else {
                renderableComponent.setScreenPosition(this.x, 0);
            }
        });
    }
}