import {Engine, Entity, Family, FamilyBuilder, System} from "@nova-engine/ecs";
import {sharedProvide} from "../../util/SharedProvide";
import {inject} from "inversify";
import {CameraSystem} from "../../services/render/CameraSystem";
import {ControllableComponent} from "../../components/input/ControllableComponent";
import {WorldPositionComponent} from "../../components/WorldPositionComponent";

const lerp = require('lerp');

@sharedProvide(CameraControlSystem)
export class CameraControlSystem extends System {
    @inject(CameraSystem) protected cameraSystem: CameraSystem;

    protected family: Family;

    onAttach(engine: Engine): void {
        this.family = new FamilyBuilder(engine).include(ControllableComponent).build();
    }

    update(engine: Engine, delta: number): void {

        const currentEntity = this.family.entities.find((entity: Entity) => {
            const controllableComponent = entity.getComponent(ControllableComponent);

            return controllableComponent.active === true;
        });

        const worldPositionComponent = currentEntity.getComponent(WorldPositionComponent);

        this.cameraSystem.x = lerp(this.cameraSystem.x, worldPositionComponent.x, 0.1) - 25;
        this.cameraSystem.y = lerp(this.cameraSystem.y, worldPositionComponent.y, 0.1) - 22;
    }

}