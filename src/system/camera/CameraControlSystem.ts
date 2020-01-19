import {Engine} from "@nova-engine/ecs";
import {InputEventListener} from "../../interface/input/InputEventListener";
import {sharedProvide} from "../../util/SharedProvide";
import {inject} from "inversify";
import {CameraSystem} from "../../services/render/CameraSystem";
import {AbstractDirectionalControl} from "../entity/AbstractDirectionalControl";


@sharedProvide(CameraControlSystem)
export class CameraControlSystem extends AbstractDirectionalControl implements InputEventListener {
    @inject(CameraSystem) protected cameraSystem: CameraSystem;

    update(engine: Engine, delta: number): void {
        const vertDir = 0;
        //const vertDir = +!!this.isMovingUp - +!!this.isMovingDown;
        const horizDir = +!!this.isMovingRight - +!!this.isMovingLeft;

        this.cameraSystem.x += delta * horizDir;
        this.cameraSystem.y -= delta * vertDir;


    }

}