import {sharedProvide} from "../util/SharedProvide";
import {Engine, Entity, Family, FamilyBuilder, System} from "@nova-engine/ecs";
import {PhysicsComponent} from "../components/PhysicsComponent";
import {WorldPositionComponent} from "../components/WorldPositionComponent";

@sharedProvide(PhysicsSystem)
export class PhysicsSystem extends System {
    protected family: Family;

    onAttach(engine: Engine): void {
        this.family = new FamilyBuilder(engine).include(PhysicsComponent).build();
    }

    update(engine: Engine, delta: number): void {
        this.family.entities.forEach((entity: Entity) => {
            const worldPositionComponent = entity.getComponent(WorldPositionComponent);
            const physicsComponent = entity.getComponent(PhysicsComponent);

            worldPositionComponent.x = physicsComponent.box.position.x;
            worldPositionComponent.y = physicsComponent.box.position.y;
        });
    }

}