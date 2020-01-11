import {Engine, Family, FamilyBuilder, System} from "@nova-engine/ecs";
import {RenderApplication} from "../../services/RenderApplication";
import {decorate, inject, injectable} from "inversify";
import {sharedProvide} from "../../util/SharedProvide";
import {SpriteRenderComponent} from "../../components/SpriteRenderComponent";

// Eurgh, why does the parent have to be injectable?
decorate(injectable(), System);

// @provide makes this class injectable, but also binds this class to the given identifier
// @sharedProvide makes one instance shared through the entire container - a "singleton"
// although I don't agree with the term
// https://github.com/inversify/inversify-binding-decorators/
@sharedProvide(RenderingSystem)
export class RenderingSystem extends System {
    @inject(RenderApplication) protected renderApplication: RenderApplication;

    protected family: Family;

    onAttach(engine: Engine): void {
        this.family = new FamilyBuilder(engine).include(SpriteRenderComponent).build();
    }

    update(engine: Engine, delta: number): void {

    }
}