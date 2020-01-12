import {Engine, Entity, Family, FamilyBuilder, System} from "@nova-engine/ecs";
import {RenderApplication} from "../../services/RenderApplication";
import {decorate, inject, injectable} from "inversify";
import {sharedProvide} from "../../util/SharedProvide";
import {BackgroundLayerComponent} from "../../components/rendering/BackgroundLayerComponent";

// Eurgh, why does the parent have to be injectable?
decorate(injectable(), System);

// @provide makes this class injectable, but also binds this class to the given identifier
// @sharedProvide makes one instance shared through the entire container - a "singleton"
// although I don't agree with the term
// https://github.com/inversify/inversify-binding-decorators/
@sharedProvide(SideScrollingBackgroundRenderingSystem)
export class SideScrollingBackgroundRenderingSystem extends System {
    @inject(RenderApplication) protected renderApplication: RenderApplication;

    protected family: Family;
    protected x = 0;

    onAttach(engine: Engine): void {
        this.family = new FamilyBuilder(engine).include(BackgroundLayerComponent).build();
    }

    update(engine: Engine, delta: number): void {

        this.x -= 0.05 * delta;

        this.family.entities.forEach((entity: Entity) => {
            const backgroundLayerComponent = entity.getComponent(BackgroundLayerComponent);
            backgroundLayerComponent.sprite.tilePosition.x = this.x / backgroundLayerComponent.distance;
        });
    }
}