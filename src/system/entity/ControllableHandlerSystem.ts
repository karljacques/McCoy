import {Engine, Entity, Family, FamilyBuilder} from "@nova-engine/ecs";
import {AbstractDirectionalControl} from "./AbstractDirectionalControl";
import {ControllableComponent} from "../../components/input/ControllableComponent";
import {WorldPositionComponent} from "../../components/WorldPositionComponent";
import {sharedProvide} from "../../util/SharedProvide";
import {CharacterAnimationComponent} from "../../components/CharacterAnimationComponent";

@sharedProvide(ControllableHandlerSystem)
export class ControllableHandlerSystem extends AbstractDirectionalControl {

    protected family: Family;

    onAttach(engine: Engine): void {
        this.family = new FamilyBuilder(engine).include(ControllableComponent).build();
    }

    update(engine: Engine, delta: number): void {
        this.family.entities.forEach((entity: Entity) => {
            const controllableComponent = entity.getComponent(ControllableComponent);

            if (controllableComponent.active) {
                const worldPositionComponent = entity.getComponent(WorldPositionComponent);

                const horizDir = +!!this.isMovingRight - +!!this.isMovingLeft;
                const vertDir = +!!this.isMovingUp - +!!this.isMovingDown;

                worldPositionComponent.x += horizDir * delta * 0.2;
                worldPositionComponent.y += vertDir * delta * 0.2;

                if (entity.hasComponent(CharacterAnimationComponent)) {
                    const characterAnimationComponent = entity.getComponent(CharacterAnimationComponent);

                    characterAnimationComponent.running = Math.abs(horizDir) > 0;
                    characterAnimationComponent.jumping = Math.abs(vertDir) > 0;

                    if (horizDir !== 0) {
                        characterAnimationComponent.directionX = horizDir;
                    }
                }
            }
        });
    }

}