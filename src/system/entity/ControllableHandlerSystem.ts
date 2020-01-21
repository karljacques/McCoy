import {Engine, Entity, Family, FamilyBuilder} from "@nova-engine/ecs";
import {AbstractDirectionalControl} from "./AbstractDirectionalControl";
import {ControllableComponent} from "../../components/input/ControllableComponent";
import {sharedProvide} from "../../util/SharedProvide";
import {CharacterAnimationComponent} from "../../components/CharacterAnimationComponent";
import {PhysicsComponent} from "../../components/PhysicsComponent";
import * as Matter from "matter-js";
import {Vector} from "matter-js";

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

                const horizDir = +!!this.isMovingRight - +!!this.isMovingLeft;
                const vertDir = +!!this.isMovingDown - +!!this.isMovingUp;

                const physicsComponent = entity.getComponent(PhysicsComponent);

                Matter.Body.applyForce(physicsComponent.box, Vector.create(physicsComponent.box.position.x, physicsComponent.box.position.y), Vector.create(horizDir * 0.5 * delta / 1000.0, vertDir * delta / 1000));
                Matter.Body.setAngle(physicsComponent.box, 0);

                if (physicsComponent.box.velocity.x > 1) {
                    Matter.Body.setVelocity(physicsComponent.box, Vector.create(1, physicsComponent.box.velocity.y));
                }


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