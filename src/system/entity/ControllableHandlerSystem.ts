import {Engine, Entity, Family, FamilyBuilder} from "@nova-engine/ecs";
import {AbstractDirectionalControl} from "./AbstractDirectionalControl";
import {ControllableComponent} from "../../components/input/ControllableComponent";
import {sharedProvide} from "../../util/SharedProvide";
import {CharacterAnimationComponent} from "../../components/CharacterAnimationComponent";
import {PhysicsComponent} from "../../components/PhysicsComponent";
import * as Matter from "matter-js";
import {Vector} from "matter-js";
import {InputEventListener} from "../../interface/input/InputEventListener";

@sharedProvide(ControllableHandlerSystem)
export class ControllableHandlerSystem extends AbstractDirectionalControl implements InputEventListener {

    protected family: Family;

    onAttach(engine: Engine): void {
        this.family = new FamilyBuilder(engine).include(ControllableComponent).build();
    }

    update(engine: Engine, delta: number): void {
        const entity = this.getControllableEntity();

        if (!entity)
            return;

        const horizDir = +!!this.isMovingRight - +!!this.isMovingLeft;
        const physicsComponent = entity.getComponent(PhysicsComponent);
        const controllableComponent = entity.getComponent(ControllableComponent);

        Matter.Body.applyForce(physicsComponent.box, Vector.create(physicsComponent.box.position.x, physicsComponent.box.position.y), Vector.create(horizDir * 0.5 * delta / 1000.0, 0));

        if (physicsComponent.box.velocity.x > 1) {
            Matter.Body.setVelocity(physicsComponent.box, Vector.create(1, physicsComponent.box.velocity.y));
        }

        if (physicsComponent.box.velocity.x < -1) {
            Matter.Body.setVelocity(physicsComponent.box, Vector.create(-1, physicsComponent.box.velocity.y));
        }

        if (physicsComponent.box.velocity.y < -0.1) {
            controllableComponent.onGround = false;
        }

        if (entity.hasComponent(CharacterAnimationComponent)) {
            const characterAnimationComponent = entity.getComponent(CharacterAnimationComponent);

            characterAnimationComponent.running = Math.abs(horizDir) > 0;

            characterAnimationComponent.jumping = !controllableComponent.onGround;

            if (horizDir !== 0) {
                characterAnimationComponent.directionX = horizDir;
            }
        }
    }

    onInputEvent(type: string, event: Event): void {
        super.onInputEvent(type, event);

        if (type === 'keydown') {
            if ((event as KeyboardEvent).key === ' ') {
                const entity = this.getControllableEntity();

                const controllableComponent = entity.getComponent(ControllableComponent);
                const physicsComponent = entity.getComponent(PhysicsComponent);

                if (this.isMovingUp && (controllableComponent.onGround || !controllableComponent.doubleJumpSpent)) {

                    if (!controllableComponent.onGround) {
                        controllableComponent.doubleJumpSpent = true;
                    }
                    Matter.Body.applyForce(physicsComponent.box, Vector.create(physicsComponent.box.position.x, physicsComponent.box.position.y), Vector.create(0, -0.05));

                    controllableComponent.onGround = false;
                }
            }
        }
    }

    protected getControllableEntity(): Entity | null {
        return this.family.entities.find((entity: Entity) => {
            const controllableComponent = entity.getComponent(ControllableComponent);

            return controllableComponent.active;
        });

    }
}